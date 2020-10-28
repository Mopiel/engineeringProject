import time

from beacontools import BeaconScanner, EddystoneTLMFrame, EddystoneFilter


# scan for all TLM frames of beacons in the namespace "12345678901234678901"
# scanner = BeaconScanner(callback,
#     # remove the following line to see packets from all beacons
#     #device_filter=EddystoneFilter(namespace="11111111-1111-1111-1111-111111111111"),
#     #packet_filter=EddystoneTLMFrame
# )
# scanner.start()
# time.sleep(10)
# scanner.stop()

def scan(scanTime):
    scanArray = []
    def callback(bt_addr, rssi, packet, additional_info):
        if(additional_info and additional_info["uuid"] == "11111111-1111-1111-1111-111111111111"):
            added = False
            for scan in scanArray:
                if(scan["addr"] == bt_addr):
                    scan["rssi"].append(rssi)
                    added = True
                    break
            if(added == False):
                scanArray.append({"addr":bt_addr, "rssi":[rssi], "uuid":additional_info["uuid"],"major":additional_info["major"]})

    scanner = BeaconScanner(callback)
    scanner.start()
    time.sleep(scanTime)
    scanner.stop()
    newArray = []
    for scan in scanArray:
        newArray.append({"addr":scan["addr"], "rssi":sum(scan["rssi"])/len(scan["rssi"]), "uuid":scan["uuid"],"major":scan["major"]})
    return newArray


for x in range(20):
    print(scan(1))
