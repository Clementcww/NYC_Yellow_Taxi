from http.server import BaseHTTPRequestHandler
from google.cloud import bigquery
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Construct a BigQuery client object.
            # Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your Vercel project settings.
            client = bigquery.Client(project='gen-lang-client-0589793979')

            # Define the query
                SELECT * FROM (
                    SELECT
                        t.pickup_datetime,
                        t.dropoff_datetime,
                        t.trip_distance,
                        t.fare_amount,
                        z.borough
                    FROM
                        `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
                    JOIN
                        `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
                    ON
                        t.pickup_location_id = z.zone_id
                    WHERE
                        z.borough = 'Manhattan'
                    ORDER BY t.pickup_datetime DESC LIMIT 33
                )
                UNION ALL
                SELECT * FROM (
                    SELECT
                        t.pickup_datetime,
                        t.dropoff_datetime,
                        t.trip_distance,
                        t.fare_amount,
                        z.borough
                    FROM
                        `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
                    JOIN
                        `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
                    ON
                        t.pickup_location_id = z.zone_id
                    WHERE
                        z.borough = 'Queens'
                    ORDER BY t.pickup_datetime DESC LIMIT 33
                )
                UNION ALL
                SELECT * FROM (
                    SELECT
                        t.pickup_datetime,
                        t.dropoff_datetime,
                        t.trip_distance,
                        t.fare_amount,
                        z.borough
                    FROM
                        `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
                    JOIN
                        `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
                    ON
                        t.pickup_location_id = z.zone_id
                    WHERE
                        z.borough = 'Brooklyn'
                    ORDER BY t.pickup_datetime DESC LIMIT 34
                )

            # Run the query
            query_job = client.query(query)
            df = query_job.to_dataframe()

            # Convert DataFrame to JSON
            # orient='records' gives a list of objects: [{"col": val}, ...]
            # date_format='iso' ensures datetimes are strings
            json_data = df.to_json(orient='records', date_format='iso')

            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # Allow CORS for the frontend
            self.end_headers()
            self.wfile.write(json_data.encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = json.dumps({"error": str(e)})
            self.wfile.write(error_response.encode('utf-8'))
