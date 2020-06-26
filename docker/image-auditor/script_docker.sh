docker build -t res/auditor .
docker run -d -p 2205:2205 res/auditor