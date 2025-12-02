import re


# validators

def email_validator(email):
    pattern = r'^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9_\.-]+\.[a-zA-Z0-9_]+$'
    if re.match(pattern, email):
        return "valid"
    else:
        return "invalid"
    
def contact_validator(number):
    pattern = r'^(0|91)?\d{10}$'
    if re.match(pattern, number):
        return "valid"
    else:
        return "invalid"
    
user_mail = input("Enter mail id : ")
print(f"Email check: {email_validator(user_mail)}")

mobile_no = input("Enter contact number : ")
print(f"contact check: {contact_validator(mobile_no)}")


# extraction

text = "paymentadviceto:allhourselectricalwaabn:54788190299tel:92752839email:service@allhourselectricalwa.com.aucustomertuvakhusidinvoicenumberinv-3649amountdue0.00duedate4jan2025amountenclosedentertheamountyouarepayingabovetaxinvoicetuvakhusidinvoicedate4jan2025invoicenumberinv-3649referencej2911abn54788190299allhourselectricalwaabn:54788190299tel:92752839email:service@allhourselectricalwa.com.audescriptionquantityunitpricegstamountaudinstalled1xclientsuppliedlight1.00150.0010%150.00job:j2911jobaddress:8salamanderstreet,dianellasubtotal150.00totalgst10%15.00totalaud165.00addcreditcardprocessingfee2.81lessamountpaid167.81amountdue0.00duedate:4jan2025pleaseusetheinvoicenumberasthepaymentreference.eftdetails:bsb066-167accno10617158paymenttermsstrictly:14daysifthereareanyqueriesaboutthisinvoice,pleasedonothesitatetocontactus.thankyouforusingus,weappreciateyourbusiness!"

abn = re.findall(r'abn:?(\d{11})', text)
print(f"ABN number : {abn}")

due_date = re.findall(r'duedate:?(\d+[a-z]{3}\d{4})', text)
print(f"due_date :{due_date}")

email = re.findall(r'email:?([a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,3})', text)
print(f"email : {email}")

amount_due = re.findall(r'amountdue:?([0-9]+\.[0-9]{2})', text)
print(f"amout_due : {amount_due}")

amount_paid = re.findall(r'amountpaid:?([\d\.]+)',text)
print(f"amount_paid : {amount_paid}")

invoice_date = re.findall(r'invoicedate:?(\d+[a-z]{3}\d{4})', text)
print(f"invoice_date : {invoice_date}")