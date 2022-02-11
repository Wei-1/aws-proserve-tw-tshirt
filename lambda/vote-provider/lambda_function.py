import json
import boto3

s3 = boto3.resource("s3")


def listFile(bucket_name, prefix):
    s3_conn = boto3.client('s3')
    s3_result = s3_conn.list_objects_v2(Bucket=bucket_name, Prefix=prefix, Delimiter = "/")
    file_list = []
    if 'Contents' in s3_result:
        for key in s3_result['Contents']:
            file_list.append(key['Key'])
        print(f"List count: {len(file_list)}")
        while s3_result['IsTruncated']:
            continuation_key = s3_result['NextContinuationToken']
            s3_result = s3_conn.list_objects_v2(Bucket=bucket_name, Prefix=prefix, Delimiter="/", ContinuationToken=continuation_key)
            for key in s3_result['Contents']:
                file_list.append(key['Key'])
            print(f"List count: {len(file_list)}")
    return file_list


def getS3Object(bucket_name, key):
    obj = s3.Object(bucket_name, key)
    data = obj.get()['Body'].read().decode('utf-8')
    return json.loads(data)
    

def extractVoteInfo(id, obj):
    return {"id": id, "text": obj['data'][3]['data'], "image": obj['data'][2]['data']}


def lambda_handler(event, context):
    print(event)

    bucket_name = 'lake-ingest-621149070359'
    prefix = 'tshirt/survey/'
    
    file_list = listFile(bucket_name, prefix)
    print(file_list)

    res = [getS3Object(bucket_name, key) for key in file_list]
    res = [extractVoteInfo(id, obj) for id, obj in enumerate(res)]
    print(res)

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': 'https://wei-1.github.io',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        'body': json.dumps(res)
    }
