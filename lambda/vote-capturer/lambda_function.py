import time
import math
import json
import boto3
import uuid

s3 = boto3.resource("s3")


def getUUID():
    return str(uuid.uuid4()) + "-" + str(math.floor(time.time() * 1000))


def saveFile(bucket_name, key, body):
    s3.Bucket(bucket_name).put_object(Key=key, Body=body)


def lambda_handler(event, context):
    print(event)
    
    if(event['body']):
        encoded_string = event['body'].encode("utf-8")
        bucket_name = "ingress-survey-capture-621149070359"
        file_name = getUUID()
        s3_path = "vote/" + file_name
        saveFile(bucket_name, s3_path, encoded_string)
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': 'https://wei-1.github.io',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps(f'Successfully Updated! File-ID: {file_name}')
        }

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'https://wei-1.github.io',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps('in execution!')
    }
