import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# --- Step 1: Load the Dataset ---
try:
    data = pd.read_csv('Crop_recommendation.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: 'Crop_recommendation.csv' not found. Please place it in the CropAI folder.")
    exit()

# --- Step 2: Prepare the Data ---
# X contains the features (ingredients), y contains the label (the dish)
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

# --- Step 3: Train the AI Model ---
print("Training the AI model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)
print("Model training complete.")

# --- Step 4: Save the Trained Model ---
# The model will be saved inside the 'backend' folder
model_filename = 'crop_model.pkl'
backend_dir = 'backend'
if not os.path.exists(backend_dir):
    os.makedirs(backend_dir)

joblib.dump(model, os.path.join(backend_dir, model_filename))
print(f"Model saved as '{model_filename}' inside the '{backend_dir}' folder.")