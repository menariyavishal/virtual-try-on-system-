import cv2
import mediapipe as mp
import json
import os
import numpy as np

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.7, model_complexity=1)

def calculate_distance(point1, point2):
    """
    Calculates the distance between two points in pixels.
    """
    return ((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2) ** 0.5

def get_shoulder_width(frame, face_width_cm=16):
    """
    Detects shoulders and calculates the shoulder width in centimeters.
    Args:
        frame: The input frame from the webcam.
        face_width_cm: Average human face width in cm (used for pixel-to-cm scaling).
    Returns:
        Shoulder width in centimeters and the modified frame with annotations.
    """
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Extract shoulder landmarks (left and right shoulders)
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]

        # Convert normalized coordinates to pixels
        height, width, _ = frame.shape
        left_shoulder_px = (int(left_shoulder.x * width), int(left_shoulder.y * height))
        right_shoulder_px = (int(right_shoulder.x * width), int(right_shoulder.y * height))

        # Calculate the distance between shoulders in pixels
        shoulder_width_px = calculate_distance(left_shoulder_px, right_shoulder_px)

        # Use face width to convert pixels to centimeters
        face_landmarks = [mp_pose.PoseLandmark.NOSE, mp_pose.PoseLandmark.LEFT_EAR]
        face_px_distance = calculate_distance(
            (int(landmarks[face_landmarks[0]].x * width), int(landmarks[face_landmarks[0]].y * height)),
            (int(landmarks[face_landmarks[1]].x * width), int(landmarks[face_landmarks[1]].y * height))
        )

        px_to_cm_ratio = face_width_cm / face_px_distance
        shoulder_width_cm = shoulder_width_px * px_to_cm_ratio

        # Annotate the frame
        annotated_frame = frame.copy()
        cv2.line(annotated_frame, left_shoulder_px, right_shoulder_px, (0, 255, 0), 2)
        cv2.putText(annotated_frame, f"Shoulder Width: {shoulder_width_cm:.2f} cm",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

        return shoulder_width_cm, annotated_frame

    return None, frame

def save_dimensions(dimensions, file_path):
    """
    Saves the measured dimensions to a JSON file.
    Args:
        dimensions: A dictionary containing the dimensions.
        file_path: Path to the JSON file.
    """
    try:
        # Ensure the directory exists
        directory = os.path.dirname(file_path)
        if not os.path.exists(directory):
            os.makedirs(directory)  # Create the directory if it doesn't exist

        # Save the dimensions to the file
        with open(file_path, "w") as f:
            json.dump(dimensions, f, indent=4)
        print(f"Dimensions saved successfully to {file_path}.")
    except Exception as e:
        print(f"Failed to save dimensions: {e}")


def main():
    cap = cv2.VideoCapture(0)

    # Updated Path to save the JSON file in `ai_models/saved_dimensions/`
    json_file_path = os.path.join("saved_dimensions", "dimensions.json")
    saved_dimensions = None
    dimension_readings = []
    CONFIDENCE_FRAMES = 10  # Number of consistent frames required for confidence

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        shoulder_width_cm, annotated_frame = get_shoulder_width(frame)

        if shoulder_width_cm is not None:
            dimension_readings.append(shoulder_width_cm)

            # Keep only the last 10 readings
            if len(dimension_readings) > CONFIDENCE_FRAMES:
                dimension_readings.pop(0)

            # Check if readings are consistent
            if len(dimension_readings) == CONFIDENCE_FRAMES:
                std_dev = np.std(dimension_readings)
                print(f"Standard Deviation: {std_dev:.4f} cm")

                if std_dev < 0.1:  # Threshold for consistency
                    saved_dimensions = {"Shoulder Width (cm)": round(np.mean(dimension_readings), 2)}
                    save_dimensions(saved_dimensions, json_file_path)
                    print(f"Measured Dimensions: {saved_dimensions}")
                    print(f"Dimensions saved to {json_file_path}")
                    break

        # Display the frame with annotations
        cv2.imshow("Shoulder Scanner", annotated_frame)

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
