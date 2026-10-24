# 03 · Skill Syllabus per Role

<aside>
💡

Every AI role shares one core — **Python, SQL, LeetCode-medium DSA, Docker/Kubernetes/CI-CD and one cloud**. The role layer below comes from the real GCC job descriptions in segment 02.

</aside>

## Common core (all roles)

- DSA (arrays to graphs)
- SQL (joins, anti-joins, window functions)
- OOP and design patterns
- REST / gRPC
- Git and Linux
- Distributed-systems basics

## Pick the cloud of your target GCC

| Cloud | Example GCCs |
| --- | --- |
| GCP | Costco, Wells Fargo |
| AWS | Lilly, Nike |
| Azure | UKG, The Standard |
| Any | JPMorgan, Target |

## Role layer

| Role | Math / ML depth | Tools & frameworks | GenAI layer | Grounded in |
| --- | --- | --- | --- | --- |
| **ML Engineer** | Linear algebra, probability, supervised/unsupervised, gradient boosting, DL basics, metrics, imbalanced data | PyTorch/TF, scikit-learn, XGBoost, Spark/Hive, feature stores, MLflow, Airflow/Kubeflow, SageMaker / Vertex AI / Azure ML | Embeddings, fine-tuning basics | Walmart Staff DS (MLE) |
| **GenAI / LLM Engineer** | Transformer basics, embeddings, retrieval metrics | Python async, FastAPI; FAISS, Pinecone, OpenSearch, Chroma; Neo4j | RAG end to end; agents with LangGraph/LangChain/LlamaIndex; evals and regression tests; guardrails; LoRA | JPMorgan SE III, Wells Fargo Lead AI Eng., Goldman Sachs Associate |
| **AI Platform / MLOps** | Enough ML to debug drift and serving | Docker, Kubernetes, Terraform, GitHub Actions/Jenkins, MLflow/W&B, Kubeflow/Vertex Pipelines, Airflow/Prefect, Triton | LLMOps: serving, cost/latency monitoring, A/B and rollback | Costco IT MLOps; Lilly Sr MLE |
| **AI / ML Data Engineer** | Data modelling, data-quality checks | SQL, PySpark, Databricks, Delta Lake, Unity Catalog, medallion layers, Airflow, Kafka, Parquet | AI-ready data: document parsing, embedding pipelines, vector search | The Standard DE III; UKG AI DE II |
| **Data / Applied Scientist** | Hypothesis tests, A/B tests, regression, forecasting, NLP, ranking/recsys, interpretability | Python/R, SQL, Spark, PyTorch, MLflow, Ray | Fine-tuning and evaluating LLMs for search/ranking | Walmart Staff DS; JPMorgan Applied AI ML Sr Assoc. |
| **AI Backend Engineer** | Light: enough to integrate models | Java/Kotlin + Spring Boot or Python microservices; Kafka; Postgres/Mongo/Cassandra; Prometheus/Grafana/ELK | LLM APIs, MCP tools, reducing hallucinations, testing LLM features | Target Lead Engineer – Gen AI |
| **AI Architect / Lead** | Broad ML and systems judgement | SageMaker / Databricks / Azure ML / Vertex AI platform design; IaC | Multi-agent design (A2A, MCP), Graph-RAG, agent evals; governance, LLM FinOps | Nike Principal SWE; Lilly Lead Architect |

## What interviews actually test (self-reported, directional)

- **Lowe's DS campus:** probability, a scikit-learn task, R², precision/recall, imbalanced data, project deep dive ([GfG](https://www.geeksforgeeks.org/lowes-india-interview-experience-for-data-scientist-on-campus-2023/)).
- **Amex DS campus:** aptitude and coding OA, then SQL, guesstimates and puzzles ([GfG](https://www.geeksforgeeks.org/interview-experiences/american-express-amex-online-assessment-oa-interview-experience-experience-interview/)).
- **Walmart SDE3:** two DSA + SQL rounds, language internals, hiring-manager round on AI/ML interest ([GfG](https://www.geeksforgeeks.org/interview-experiences/walmart-global-tech-interview-experience-for-sde3/)).
- **GenAI roles:** expect RAG/agent design and an eval discussion in place of a classic ML-theory round.