from .email_sender import send_email

def send_mom_email(summary, actions):
    """
    Adapts MoM action items to the existing send_email() format.
    """

    formatted_actions = []

    for item in actions:
        formatted_actions.append({
            "action": item.text,
            "deadline": item.deadline
        })

    # Reuse the existing email sender
    send_email(summary, formatted_actions)
