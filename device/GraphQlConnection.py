import requests
import json
from datetime import datetime
from uuid import getnode as get_mac

url = 'http://192.168.1.14:4000/graphql'
mac_hex = "{:012x}".format(get_mac())
device = ":".join(mac_hex[i:i+2] for i in range(0, len(mac_hex), 2))


def sendData(name, rssi):

    query = 'mutation { updateBeacon( name: "'+name+'", device: "' + \
        device+'", rssi: ' + str(rssi) + ') { id } }'

    json = {'query':  query}

    r = requests.post(url=url, json=json)

    if(r.status_code == 200):
        return True
    return False

print(sendData("12:31:12:42:21:35:52", 42))
