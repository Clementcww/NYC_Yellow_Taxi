from google.cloud import bigquery
import pandas as pd

def fetch_taxi_data():
    """
    Fetches the last 10,000 trips from the NYC Yellow Taxi dataset in BigQuery.
    """
    # Construct a BigQuery client object.
    # Note: This assumes you have authenticated via 'gcloud auth application-default login'
    # or set the GOOGLE_APPLICATION_CREDENTIALS environment variable.
    # We explicitly set the project ID to avoid environment issues.
    client = bigquery.Client(project='gen-lang-client-0589793979')

    # Define the query
    # We join with the taxi_zone_geom table to get the borough.
    # We filter for Manhattan, Queens, and Brooklyn.
    query = """
        SELECT
            t.*,
            z.borough
        FROM
            `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` AS t
        JOIN
            `bigquery-public-data.new_york_taxi_trips.taxi_zone_geom` AS z
        ON
            t.pickup_location_id = z.zone_id
        WHERE
            z.borough IN ('Manhattan', 'Queens', 'Brooklyn')
        ORDER BY
            t.pickup_datetime DESC
        LIMIT 10000
    """

    print("Querying BigQuery...")
    try:
        query_job = client.query(query)  # Make an API request.
        
        print("Downloading results to DataFrame...")
        df = query_job.to_dataframe()
        
        print(f"Successfully fetched {len(df)} rows.")
        print("\nFirst 5 rows:")
        print(df.head())
        
        print("\nDataFrame Info:")
        print(df.info())

        # Fragment the dataset by borough
        boroughs = ['Manhattan', 'Queens', 'Brooklyn']
        
        for borough in boroughs:
            borough_df = df[df['borough'] == borough]
            filename = f"{borough.lower()}_trips.csv"
            borough_df.to_csv(filename, index=False)
            print(f"Saved {len(borough_df)} rows to {filename}")
        
        return df

    except Exception as e:
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    fetch_taxi_data()
