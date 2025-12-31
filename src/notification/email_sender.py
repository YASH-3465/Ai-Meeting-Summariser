import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()  # load .env file

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))


def send_email(summary, actions):
    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise ValueError("Email credentials not found in .env file")

    body = "MEETING SUMMARY\n\n"
    body += summary + "\n\n"
    body += "ACTION ITEMS\n\n"

    for a in actions:
        body += f"- {a['action']}\n"
        if a["deadline"]:
            body += f"  Deadline: {a['deadline']}\n"
        body += "\n"

    msg = MIMEText(body)
    msg["Subject"] = "Meeting Summary and Action Items"
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = EMAIL_ADDRESS   # admin receives the mail

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()
