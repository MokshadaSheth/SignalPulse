"""Rule-based domain categorization engine."""

# Extensible category rules: domain substring → category
DOMAIN_RULES: dict[str, str] = {
    # Work
    "docs.google.com": "work",
    "github.com": "work",
    "gitlab.com": "work",
    "bitbucket.org": "work",
    "notion.so": "work",
    "figma.com": "work",
    "jira.atlassian.com": "work",
    "confluence.atlassian.com": "work",
    "trello.com": "work",
    "asana.com": "work",
    "linear.app": "work",
    "stackoverflow.com": "work",
    "vscode.dev": "work",
    "codepen.io": "work",
    "replit.com": "work",
    # Communication
    "meet.google.com": "communication",
    "mail.google.com": "communication",
    "outlook.live.com": "communication",
    "outlook.office.com": "communication",
    "teams.microsoft.com": "communication",
    "slack.com": "communication",
    "discord.com": "communication",
    "zoom.us": "communication",
    "calendar.google.com": "communication",
    # Distraction
    "youtube.com": "distraction",
    "netflix.com": "distraction",
    "instagram.com": "distraction",
    "facebook.com": "distraction",
    "twitter.com": "distraction",
    "x.com": "distraction",
    "reddit.com": "distraction",
    "tiktok.com": "distraction",
    "twitch.tv": "distraction",
    "hulu.com": "distraction",
    "pinterest.com": "distraction",
    "espn.com": "distraction",
    "amazon.com": "distraction",
    "ebay.com": "distraction",
}


def categorize_domain(domain: str) -> str:
    """Categorize a domain. Unknown domains default to 'work'."""
    domain_lower = domain.lower()
    for rule_domain, category in DOMAIN_RULES.items():
        if rule_domain in domain_lower:
            return category
    return "work"  # Unknown domains default to work
