from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

app = FastAPI()

MODEL_DIR = "emotion_model"
tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, trust_remote_code=True, local_files_only=True)
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_DIR, trust_remote_code=True, local_files_only=True
)
device = torch.device("cpu")
model.to(device)
model.eval()

class PredictRequest(BaseModel):
    text: str

import json, os
with open(os.path.join(MODEL_DIR, "label2id.json"), "r", encoding="utf-8") as f:
    label2id = json.load(f)
id2label = {v: k for k, v in label2id.items()}

@app.post("/predict")
def predict(req: PredictRequest):
    enc = tokenizer(
        req.text,
        truncation=True,
        padding=True,
        return_tensors="pt"
    )
    # → **모델과 같은 디바이스로 이동**
    enc = {k: v.to(device) for k, v in enc.items()}

    # 인퍼런스
    with torch.no_grad():
        outputs = model(**enc)
    logits = outputs.logits[0]
    probs = torch.softmax(logits, dim=0)
    pred_id = torch.argmax(probs).item()
    label = id2label[pred_id]

    return {
        "label": label,
        "scores": probs.cpu().tolist()
    }
