import json

with open("C03-Toucan-TCO2-class.jsonld", 'r') as f:
	data = json.loads(f.read())

ln = {"identifier": [], "name": []}
for method in data["regen:approvedMethodologies"]["schema:itemListElement"]:
	ln["identifier"].append(method["schema:identifier"]["@value"])
	ln["name"].append(method["schema:name"])

keys = list(ln["identifier"])
keys.sort()

for i in keys: 
	print(i)

#for identifier, name in zip(sorted_dict["identifier"], sorted_dict["name"]):
#	print("{} | {}".format(identifier, name))