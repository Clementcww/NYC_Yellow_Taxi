from google.cloud import bigquery

client = bigquery.Client(project='gen-lang-client-0589793979')
dataset_id = 'bigquery-public-data.new_york_taxi_trips'

tables = client.list_tables(dataset_id)

print("Tables contained in '{}':".format(dataset_id))
for table in tables:
    print("{}.{}".format(table.dataset_id, table.table_id))
