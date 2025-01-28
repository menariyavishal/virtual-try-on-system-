import cv2
import mediapipe as mp
import numpy as np
import json
import os

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.7, model_complexity=1)

# Updated Path to save the JSON file in `ai_models/saved_dimensions/`
json_file_path = os.path.join("saved_dimensions", "dimensions.json")

# Ensure directory exists (new functionality)
os.makedirs(os.path.dirname(json_file_path), exist_ok=True)

# Confidence tracking variables (new functionality)
saved_dimensions = None
dimension_readings = []
CONFIDENCE_FRAMES = 10  # Number of consistent frames required for confidence

def calculate_distance(point1, point2):
    """
    Calculates the Euclidean distance between two points in pixels.
    Args:
        point1: Tuple containing (x, y) coordinates of the first point.
        point2: Tuple containing (x, y) coordinates of the second point.
    Returns:
        Distance in pixels.
    """
    return ((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2) ** 0.5

def smoothed_distance(point1, point2, window_size=10):
    """
    Calculates smoothed distance using moving average. (new functionality)
    Args:
        point1: First point tuple.
        point2: Second point tuple.
        window_size: Number of previous values to consider for smoothing.
    Returns:
        Smoothed distance value.
    """
    dist = calculate_distance(point1, point2)
    dimension_readings.append(dist)
    if len(dimension_readings) > window_size:
        dimension_readings.pop(0)
    return sum(dimension_readings) / len(dimension_readings)

def save_dimensions(data, file_path):
    """
    Saves the measured dimensions to a JSON file. (new functionality)
    Args:
        data: Dictionary containing the dimensions to save.
        file_path: Path to the JSON file.
    """
    try:
        with open(file_path, "w") as json_file:
            json.dump(data, json_file, indent=4)
        print(f"Dimensions saved to {file_path}")
    except Exception as e:
        print(f"Error saving dimensions: {e}")

def get_arm_length(frame, face_width_cm=16, adjustment_factor=0.6):
    """
    Measures the arm length (shoulder to wrist) in centimeters.
    Args:
        frame: The input frame from the webcam.
        face_width_cm: Average human face width in cm (used for pixel-to-cm scaling).
        adjustment_factor: Scaling factor to adjust calculated dimensions.
    Returns:
        Arm length in centimeters and the modified frame with annotations.
    """
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Extract arm-related landmarks (shoulder, elbow, wrist)
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        left_elbow = landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]
        left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST]

        # Convert normalized coordinates to pixels
        height, width, _ = frame.shape
        shoulder_px = (int(left_shoulder.x * width), int(left_shoulder.y * height))
        elbow_px = (int(left_elbow.x * width), int(left_elbow.y * height))
        wrist_px = (int(left_wrist.x * width), int(left_wrist.y * height))

        # Calculate distances in pixels with smoothing (new functionality)
        shoulder_to_elbow_px = smoothed_distance(shoulder_px, elbow_px)
        elbow_to_wrist_px = smoothed_distance(elbow_px, wrist_px)
        arm_length_px = shoulder_to_elbow_px + elbow_to_wrist_px

        # Use face width to convert pixels to centimeters
        face_landmarks = [mp_pose.PoseLandmark.NOSE, mp_pose.PoseLandmark.LEFT_EAR]
        face_px_distance = calculate_distance(
            (int(landmarks[face_landmarks[0]].x * width), int(landmarks[face_landmarks[0]].y * height)),
            (int(landmarks[face_landmarks[1]].x * width), int(landmarks[face_landmarks[1]].y * height))
        )

        px_to_cm_ratio = face_width_cm / face_px_distance

        # Apply scaling adjustment to the calculated arm length
        arm_length_cm = arm_length_px * px_to_cm_ratio * adjustment_factor

        # Round the final result to two decimal places (new functionality)
        arm_length_cm = round(arm_length_cm, 2)

        # Annotate the frame
        annotated_frame = frame.copy()
        cv2.line(annotated_frame, shoulder_px, elbow_px, (0, 255, 0), 2)
        cv2.line(annotated_frame, elbow_px, wrist_px, (0, 255, 0), 2)
        cv2.putText(annotated_frame, f"Arm Length: {arm_length_cm:.2f} cm",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

        return arm_length_cm, annotated_frame

    return None, frame

def main():
    cap = cv2.VideoCapture(0)  # Open webcam feed

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        arm_length_cm, annotated_frame = get_arm_length(frame)

        if arm_length_cm is not None:
            dimension_readings.append(arm_length_cm)

            # Keep only the last CONFIDENCE_FRAMES readings
            if len(dimension_readings) > CONFIDENCE_FRAMES:
                dimension_readings.pop(0)

            # Check if readings are consistent
            if len(dimension_readings) == CONFIDENCE_FRAMES:
                std_dev = np.std(dimension_readings)
                print(f"Standard Deviation: {std_dev:.4f} cm")

                if std_dev < 0.1:  # Threshold for consistency
                    saved_dimensions = {"Arm Length (cm)": round(np.mean(dimension_readings), 2)}
                    save_dimensions(saved_dimensions, json_file_path)
                    print(f"Measured Dimensions: {saved_dimensions}")
                    print(f"Dimensions saved to {json_file_path}")
                    break

        # Display the frame with annotations
        cv2.imshow("Arm Scanner", annotated_frame)

        # Exit the stream on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
