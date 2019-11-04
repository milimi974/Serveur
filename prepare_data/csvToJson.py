import csv
import json

jsondata = []

d = {}
code = 0

# parsing csv file
with open('csvdata.csv', 'r') as csvfile:
    data = csv.reader(csvfile, delimiter='=', quotechar='|')
    for row in data:
        if (len(row) != 0):
            r = row[0]
            label = r[12:]

            # test if we have a domai]n
            if (r[:5] == '    C' ):
                # recover domain code
                code = r[9:11]
                name = label[1:-1].capitalize()
                d[code] = {'label': name, 'children':[]}


            # recover associated fields
            if (r[12:14] == code):
                d[code]['children'].append({
                    'cip_code': label[:7], 
                    'label': label[9:-1].capitalize()
                    })


# register in the style we need for the front
for key in d:
    jsondata.append({
        'cip_code': key, 
        'label': d[key]['label'], 
        'children': d[key]['children']
        })



# writing data in json file
with open('data.json', 'w') as jsonfile:
    json.dump(jsondata, jsonfile, indent=4)
