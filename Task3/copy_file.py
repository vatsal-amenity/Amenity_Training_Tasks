import shutil
import os

source = 'hello.txt'
destination = 'hello_copy.txt'


def copy_file():

    if os.path.exists(source):
        shutil.copy(source, destination)
        print(f"File copied from {source} to {destination}")
    else:
        print(f"file not copied.")

copy_file()