from .email_sender import send_email


def dispatch(summary, actions, notify=False):
    if not notify:
        return

    if not actions:
        return

    send_email(summary, actions)
