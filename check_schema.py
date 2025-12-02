from google.cloud import bigquery

client = bigquery.Client(project='gen-lang-client-0589793979')
table_id = 'bigquery-public-data.new_york_taxi_trips.taxi_zone_geom'

table = client.get_table(table_id)

print("Schema for {}:".format(table_id))
for schema_field in table.schema:
    print(f"{schema_field.name} ({schema_field.field_type})")
