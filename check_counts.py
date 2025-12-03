from google.cloud import bigquery
import os

def check_counts():
    try:
        client = bigquery.Client(project='gen-lang-client-0589793979')
        
        # Check counts for Brooklyn and Bronx in the 2022 dataset
        # We'll check the total available records to see if volume is an issue
        query = """
            SELECT
                z.borough,
                COUNT(*) as count
            FROM
                `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
            JOIN
                `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
            ON
                t.pickup_location_id = z.zone_id
            WHERE
                z.borough IN ('Brooklyn', 'Bronx')
            GROUP BY
                z.borough
        """
        
        query_job = client.query(query)
        results = query_job.result()
        
        print("Record counts by borough (2022):")
        for row in results:
            print(f"{row.borough}: {row.count}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_counts()
