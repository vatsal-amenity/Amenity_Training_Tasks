import os
import shutil


source_folder = 'real'
destination_folder = 'real_copy'

def copy_folder():
       
    if os.path.exists(source_folder):
        shutil.copytree(source_folder, destination_folder)
        print(f"folder and nested folder copied.{source_folder} to {destination_folder}")
    else:
        print("folder not copied.")

copy_folder()