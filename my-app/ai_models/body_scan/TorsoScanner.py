import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Pose
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.8, model_complexity=1)

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

def create_polygon(points, frame, color=(0, 255, 255)):
    """
    Creates a polygon connecting a list of points on the frame.
    Args:
        points: A list of points (tuples) in (x, y) format.
        frame: The frame on which the polygon is drawn.
        color: Color of the polygon (default is yellow).
    """
    polygon_points = np.array(points, dtype=np.int32)
    cv2.polylines(frame, [polygon_points], isClosed=True, color=color, thickness=2)

def get_torso_with_polygon(frame, face_width_cm=17, adjustment_factor=0.5):
    """
    Detects torso landmarks, calculates dimensions, and creates a polygon for the waist area.
    Args:
        frame: The input frame from the webcam.
        face_width_cm: Average human face width in cm (used for pixel-to-cm scaling).
        adjustment_factor: Multiplier to scale calculated dimensions to match realistic proportions.
    Returns:
        Torso length (cm), torso width (cm), and the modified frame with annotations.
    """
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  # Convert frame to RGB for MediaPipe
    results = pose.process(frame_rgb)  # Process the frame with MediaPipe Pose

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        # Extract torso landmarks: shoulders and hips
        left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP]
        right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]

        # Convert normalized coordinates to pixel values
        height, width, _ = frame.shape
        left_shoulder_px = (int(left_shoulder.x * width), int(left_shoulder.y * height))
        right_shoulder_px = (int(right_shoulder.x * width), int(right_shoulder.y * height))
        left_hip_px = (int(left_hip.x * width), int(left_hip.y * height))
        right_hip_px = (int(right_hip.x * width), int(right_hip.y * height))

        # Calculate dimensions in pixels
        torso_width_px = calculate_distance(left_shoulder_px, right_shoulder_px)  # Shoulder-to-shoulder width
        torso_length_px = (calculate_distance(left_shoulder_px, left_hip_px) +
                           calculate_distance(right_shoulder_px, right_hip_px)) / 2  # Average torso length

        # Estimate pixel-to-cm scaling ratio using face width
        face_landmarks = [mp_pose.PoseLandmark.NOSE, mp_pose.PoseLandmark.LEFT_EAR]
        face_px_distance = calculate_distance(
            (int(landmarks[face_landmarks[0]].x * width), int(landmarks[face_landmarks[0]].y * height)),
            (int(landmarks[face_landmarks[1]].x * width), int(landmarks[face_landmarks[1]].y * height))
        )
        px_to_cm_ratio = face_width_cm / face_px_distance

        # Convert dimensions to centimeters and scale with adjustment factor
        torso_width_cm = torso_width_px * px_to_cm_ratio * adjustment_factor
        torso_length_cm = torso_length_px * px_to_cm_ratio * adjustment_factor

        # Annotate the frame with measurements
        annotated_frame = frame.copy()
        cv2.line(annotated_frame, left_shoulder_px, right_shoulder_px, (0, 255, 0), 2)  # Torso width line
        cv2.line(annotated_frame, left_shoulder_px, left_hip_px, (0, 0, 255), 2)  # Left torso length line
        cv2.line(annotated_frame, right_shoulder_px, right_hip_px, (0, 0, 255), 2)  # Right torso length line

        # Draw the torso polygon (shoulders and hips)
        create_polygon([left_shoulder_px, right_shoulder_px, right_hip_px, left_hip_px], annotated_frame)

        # Display the measurements on the frame
        cv2.putText(annotated_frame, f"Torso Width: {torso_width_cm:.2f} cm",
                    (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)
        cv2.putText(annotated_frame, f"Torso Length: {torso_length_cm:.2f} cm",
                    (50, 80), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 0, 0), 2)

        return torso_length_cm, torso_width_cm, annotated_frame

    return None, None, frame

def main():
    cap = cv2.VideoCapture(0)  # Open webcam feed

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Get torso dimensions and annotate the frame
        torso_length_cm, torso_width_cm, annotated_frame = get_torso_with_polygon(frame)

        if torso_length_cm is not None and torso_width_cm is not None:
            print(f"Torso Length: {torso_length_cm:.2f} cm, Torso Width: {torso_width_cm:.2f} cm")

        # Display the annotated frame
        cv2.imshow("Torso Scanner", annotated_frame)

        # Exit the stream on pressing 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
