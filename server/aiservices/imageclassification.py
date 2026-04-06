import os
from pathlib import Path

from dotenv import load_dotenv
from inference_sdk import InferenceHTTPClient
from inference_sdk.http.errors import HTTPCallErrorError
from requests.exceptions import ConnectionError as RequestsConnectionError


BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")


def build_client():
    api_url = os.getenv("ROBOFLOW_API_URL", "https://serverless.roboflow.com")
    api_key = os.getenv("ROBOFLOW_API_KEY")

    if not api_key:
        raise RuntimeError("ROBOFLOW_API_KEY is not set in server/.env")

    return InferenceHTTPClient(api_url=api_url, api_key=api_key)


def run_image_classification():
    workspace_name = os.getenv("ROBOFLOW_WORKSPACE", "vedas-workspace")
    workflow_id = os.getenv("ROBOFLOW_WORKFLOW", "detect-and-classify")
    image_path = Path(
        os.getenv("ROBOFLOW_IMAGE_PATH", r"C:\Users\vedad\OneDrive\Desktop\pothole.webp")
    )

    if not image_path.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")

    client = build_client()
    return client.run_workflow(
        workspace_name=workspace_name,
        workflow_id=workflow_id,
        images={"image": str(image_path)},
        use_cache=True,
    )


if __name__ == "__main__":
    try:
        result = run_image_classification()
        print(result)
    except RequestsConnectionError as exc:
        api_url = os.getenv("ROBOFLOW_API_URL", "https://serverless.roboflow.com")
        if "localhost:9001" in api_url:
            raise RuntimeError(
                "Could not connect to local inference server at localhost:9001. "
                "Start the local Roboflow inference server first, or set "
                "ROBOFLOW_API_URL=https://serverless.roboflow.com in server/.env."
            ) from exc
        raise
    except HTTPCallErrorError as exc:
        raise RuntimeError(
            "Roboflow workflow request was accepted by the API, but execution failed. "
            f"Status: {exc.status_code}. Message: {exc.api_message}. "
            "If you want to avoid hosted billing/credit limits, run a local inference "
            "server and set ROBOFLOW_API_URL=http://localhost:9001."
        ) from exc
    except Exception as exc:
        raise RuntimeError(f"Image classification failed: {exc}") from exc
