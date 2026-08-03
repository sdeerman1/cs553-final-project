curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkanMwMDEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NTczNzA4OCwiZXhwIjoxNzg1NzQ0Mjg4fQ.XyglwfkRpir3gpD_qQI_5sELqbuE_fEIhGESPZQKlDU" http://localhost:3000/tasks

curl -X GET http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkanMwMDEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NTczNzA4OCwiZXhwIjoxNzg1NzQ0Mjg4fQ.XyglwfkRpir3gpD_qQI_5sELqbuE_fEIhGESPZQKlDU"

curl -X DELETE http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkanMwMDEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NTczNzA4OCwiZXhwIjoxNzg1NzQ0Mjg4fQ.XyglwfkRpir3gpD_qQI_5sELqbuE_fEIhGESPZQKlDU"

curl -X POST http://localhost:3000/reports \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkanMwMDEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NTczNzA4OCwiZXhwIjoxNzg1NzQ0Mjg4fQ.XyglwfkRpir3gpD_qQI_5sELqbuE_fEIhGESPZQKlDU"

curl -X GET http://localhost:3000/reports/227bebab-fbc5-435a-9b4d-a0f21e440590 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkanMwMDEiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc4NTczNzA4OCwiZXhwIjoxNzg1NzQ0Mjg4fQ.XyglwfkRpir3gpD_qQI_5sELqbuE_fEIhGESPZQKlDU"





curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50MDAyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.wZQnRYPdjmHMY8mgPgv2TWNOfMinWcjleIltBhoAkes" http://localhost:3000/tasks

curl -X GET http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50MDAyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.wZQnRYPdjmHMY8mgPgv2TWNOfMinWcjleIltBhoAkes"


curl -X DELETE http://localhost:3000/tasks/task-003 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50MDAyIiwicm9sZSI6InN0dWRlbnQiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.wZQnRYPdjmHMY8mgPgv2TWNOfMinWcjleIltBhoAkes"






curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnN0cnVjdG9yMDAxIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.tGC7-7PDaPwK2NmwLGu4ak1TGWzKCPOVsU8XYlxAO0M" http://localhost:3000/tasks

curl -X GET http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnN0cnVjdG9yMDAxIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.tGC7-7PDaPwK2NmwLGu4ak1TGWzKCPOVsU8XYlxAO0M"

  curl -X GET http://localhost:3000/tasks/task-003 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnN0cnVjdG9yMDAxIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.tGC7-7PDaPwK2NmwLGu4ak1TGWzKCPOVsU8XYlxAO0M"

curl -X DELETE http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnN0cnVjdG9yMDAxIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.tGC7-7PDaPwK2NmwLGu4ak1TGWzKCPOVsU8XYlxAO0M"


curl -X GET http://localhost:3000/tasks/task-001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJpbnN0cnVjdG9yMDAxIiwicm9sZSI6Imluc3RydWN0b3IiLCJpYXQiOjE3ODU3MzcwODgsImV4cCI6MTc4NTc0NDI4OH0.tGC7-7PDaPwK2NmwLGu4ak1TGWzKCPOVsU8XYlxAO0M"


