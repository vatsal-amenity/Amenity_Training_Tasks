import json
import csv

print("---------------text file read and write opration---------------")

txt_file = "vatsal.txt" 
# write opration
with open(txt_file, "w") as f:
    f.write("today is a great day.\n")
    f.write("i am task 3 in python because java file oprtion was too hard for me. \n")
    f.write("i learned file opration in python in using google or help of ai.\n")
print(f"text file wite :{txt_file}")
# read opration

print("read text")
with open(txt_file, "r") as f:
    content = f.read()
    print(content)


print("-------------json file read and write opration-------------")

json_file = "vatsal.json"
my_data={
    "name" : "vatsal",
    "role" : "frontend devlpoer"
} 

# write file

with open(json_file, "w") as f:
    json.dump(my_data, f, indent=4)
print(f"json file write {json_file}")

# read file

print("read json")
with open(json_file, "r")as f:
    data = json.load(f)
    print(f"Name :{data['name']}") 
    print(f"role: {data['role']}")




print("------------------csv file read and write opration------------------")

csv_file = "vatsal.csv"
csv_data = [
    ["ID", "Product", "Price"], 
    ["1", "Cotton Saree", "500"],
    ["2", "Silk Saree", "1200"],
    ["3", "Kurti", "350"]
]

# write file

with open(csv_file, "w", newline="")as f:
    writer = csv.writer(f)
    writer.writerows(csv_data)
print(f"write csv file {csv_file}")

#read file
print("read csv")
with open(csv_file, "r")as f:
    reader = csv.reader(f)
    for row in reader:
        print(row)
