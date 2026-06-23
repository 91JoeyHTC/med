FROM python:3.12-slim

WORKDIR /app

# 規格檔位於 monorepo packages/spec；以 build context = repo 根建置。
COPY services/engine/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY services/engine/app ./app
COPY packages/spec /packages/spec

ENV PYTHONPATH=/
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
