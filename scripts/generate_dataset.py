from google.cloud import bigquery
import pandas as pd
import os

def generate_datasets():
    try:
        # Initialize BigQuery client
        # Ensure you have authenticated with `gcloud auth application-default login`
        client = bigquery.Client(project='gen-lang-client-0589793979')
        
        boroughs = ['Manhattan', 'Queens', 'Brooklyn']
        limit_per_borough = 3000
        
        # Use absolute path or correct relative path from project root
        output_dir = 'public'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        for borough in boroughs:
            print(f"Fetching data for {borough}...")
            
            query = f"""
                SELECT
                    t.pickup_datetime,
                    t.dropoff_datetime,
                    t.trip_distance,
                    t.fare_amount,
                    t.payment_type,
                    t.total_amount,
                    z.borough
                FROM
                    `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
                JOIN
                    `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
                ON
                    t.pickup_location_id = z.zone_id
                WHERE
                    z.borough = '{borough}'
                ORDER BY
                    t.pickup_datetime DESC
                LIMIT {limit_per_borough}
            """
            
            query_job = client.query(query)
            df = query_job.to_dataframe()
            
            # Save to CSV
            filename = f"{borough.lower()}_trips.csv"
            filepath = os.path.join(output_dir, filename)
            df.to_csv(filepath, index=False)
            
            print(f"Saved {len(df)} records to {filepath}")
            
        print("All datasets generated successfully.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate_datasets()
