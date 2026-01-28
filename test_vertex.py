import vertexai
from vertexai.generative_models import GenerativeModel
import os

def test():
    project = "urbun-carbon-twin"
    location = "us-central1"
    print(f"Testing Vertex AI in project: {project}, location: {location}")
    try:
        vertexai.init(project=project, location=location)
        model = GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Hello, this is a test from the Urban Carbon Twin debugger. Please respond with 'Ready for simulation'.")
        print(f"Success: {response.text.strip()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test()
