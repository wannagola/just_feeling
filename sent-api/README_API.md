# Sentiment-API README

`sentiment-api`는 FastAPI 기반의 KoBERT 감정분석 마이크로서비스입니다.

## 디렉터리 구조
```text
sentiment-api/
├── serve.py           # FastAPI 앱 진입점
├── requirements.txt   # Python 패키지 의존성 목록
└── .venv/             # (선택) 가상환경 디렉터리
```

## Prerequisites
- Python 3.8 이상
- Git (선택)

## 1. 설치 및 환경 준비

1. `sentiment-api` 디렉터리로 이동:
   ```bash
   cd sentiment-api
   ```
2. (선택) 가상환경 생성 및 활성화:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. 의존성 설치:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

## 2. 모델 파일 준비

- `serve.py`에서 참조하는 모델 경로(`../emotion_model`)에 학습된 KoBERT 모델 디렉터리(`config.json`, `model.safetensors` 또는 `pytorch_model.bin`, `vocab.txt`, `tokenizer_config.json`, `label2id.json`)를 위치시킵니다.

## 3. 서버 실행

```bash
uvicorn serve:app --host 0.0.0.0 --port 8000
```

