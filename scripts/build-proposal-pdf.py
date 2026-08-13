#!/usr/bin/env python3
"""Build a clean shareable PDF proposal for Andy."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
    KeepTogether,
    HRFlowable,
    PageBreak,
)

OUT = "/Users/blurrd/Desktop/howMuch/web/PROPOSAL-ANDY.pdf"

RED = HexColor("#e10600")
DARK = HexColor("#15181c")
MUTED = HexColor("#555555")
LIGHT = HexColor("#f5f6f8")
PINK = HexColor("#fff7f7")
PINK_BORDER = HexColor("#f0c4c7")
FAMILY_BG = HexColor("#fff5f5")
LINK = HexColor("#c40014")
LINE = HexColor("#e2e2e2")

styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="TitleMain",
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=24,
        textColor=HexColor("#111111"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Meta",
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=MUTED,
        spaceAfter=14,
    )
)
styles.add(
    ParagraphStyle(
        name="H2",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=HexColor("#111111"),
        spaceBefore=2,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="H3",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=HexColor("#111111"),
        spaceBefore=0,
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="Body",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=HexColor("#1a1a1a"),
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyTight",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=HexColor("#1a1a1a"),
        spaceAfter=3,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=MUTED,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="Outcome",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12.5,
        textColor=HexColor("#111111"),
        spaceBefore=1,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="HeroLabel",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=HexColor("#9a9a9a"),
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="HeroBody",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=HexColor("#ececec"),
        spaceAfter=7,
    )
)
styles.add(
    ParagraphStyle(
        name="HeroPrice",
        fontName="Helvetica-Bold",
        fontSize=15,
        leading=18,
        textColor=white,
        spaceBefore=4,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="HeroNote",
        fontName="Helvetica",
        fontSize=9,
        leading=12.5,
        textColor=HexColor("#bdbdbd"),
        spaceAfter=0,
    )
)
styles.add(
    ParagraphStyle(
        name="Tag",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=9,
        textColor=LINK,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="URL",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=LINK,
        spaceAfter=5,
    )
)
styles.add(
    ParagraphStyle(
        name="Cell",
        fontName="Helvetica",
        fontSize=8.5,
        leading=11.5,
        textColor=HexColor("#1a1a1a"),
    )
)
styles.add(
    ParagraphStyle(
        name="CellBold",
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=11.5,
        textColor=HexColor("#1a1a1a"),
    )
)
styles.add(
    ParagraphStyle(
        name="BulletBody",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12.5,
        textColor=HexColor("#1a1a1a"),
    )
)


def bullets(items, space_after=6):
    flow = [
        ListItem(
            Paragraph(item, styles["BulletBody"]),
            leftIndent=6,
            bulletColor=HexColor("#1a1a1a"),
        )
        for item in items
    ]
    return ListFlowable(
        flow,
        bulletType="bullet",
        start="-",
        leftIndent=12,
        bulletFontName="Helvetica",
        bulletFontSize=8,
        spaceBefore=0,
        spaceAfter=space_after,
    )


def numbered(items):
    flow = [
        ListItem(Paragraph(item, styles["BulletBody"]), leftIndent=6) for item in items
    ]
    return ListFlowable(
        flow,
        bulletType="1",
        leftIndent=14,
        bulletFontName="Helvetica",
        bulletFontSize=9,
        spaceBefore=0,
        spaceAfter=8,
    )


def section_rule():
    return HRFlowable(
        width="100%", thickness=1.5, color=RED, spaceBefore=0, spaceAfter=8
    )


def build():
    story = []

    story.append(
        Paragraph(
            "Website Proposal<br/>for How Much Air &amp; Home Improvements",
            styles["TitleMain"],
        )
    )
    # Keep this plain. No special punctuation after Andy.
    story.append(
        Paragraph(
            "For: Andy&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;From: Milton&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Date: August 2026",
            styles["Meta"],
        )
    )

    hero = Table(
        [
            [
                [
                    Paragraph("THE SHORT VERSION", styles["HeroLabel"]),
                    Paragraph(
                        "Right now your online presence is hurting you. Two sites are fighting each other, and one does not even say you are an HVAC company anymore.",
                        styles["HeroBody"],
                    ),
                    Paragraph(
                        "This proposal fixes that with one strong website, a real customer portal, a real owner admin, payments, texts, emails, and an AI helper.",
                        styles["HeroBody"],
                    ),
                    Paragraph("Your family price: $1,500", styles["HeroPrice"]),
                    Paragraph(
                        "Normal fair price for this work: about $27,500<br/>You save about $26,000 because we are family.",
                        styles["HeroNote"],
                    ),
                ]
            ]
        ],
        colWidths=[7.2 * inch],
    )
    hero.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), DARK),
                ("LEFTPADDING", (0, 0), (-1, -1), 18),
                ("RIGHTPADDING", (0, 0), (-1, -1), 18),
                ("TOPPADDING", (0, 0), (-1, -1), 16),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
            ]
        )
    )
    story.append(hero)
    story.append(Spacer(1, 16))

    story.append(Paragraph("Your pain right now", styles["H2"]))
    story.append(section_rule())
    story.append(
        Paragraph(
            "You have two websites that pull people in two directions.",
            styles["Body"],
        )
    )

    left = [
        Paragraph("SITE 1 - YOUR REAL BRAND", styles["Tag"]),
        Paragraph(
            '<link href="https://trusthowmuch.com">trusthowmuch.com</link>',
            styles["URL"],
        ),
        Paragraph(
            "This is the domain people already know. It is tied to How Much Air &amp; Home Improvements.",
            styles["Small"],
        ),
    ]
    right = [
        Paragraph("SITE 2 - THE OTHER COMPANY'S SITE", styles["Tag"]),
        Paragraph(
            '<link href="https://askhowmuch.work/home">askhowmuch.work/home</link>',
            styles["URL"],
        ),
        Paragraph(
            "Another company set this up as a different web address instead of using the domain you already had.",
            styles["Small"],
        ),
    ]
    sites = Table([[left, right]], colWidths=[3.5 * inch, 3.5 * inch])
    sites.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PINK),
                ("BOX", (0, 0), (-1, -1), 1, PINK_BORDER),
                ("LINEAFTER", (0, 0), (0, 0), 1, PINK_BORDER),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 14),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(sites)
    story.append(Spacer(1, 12))

    story.append(Paragraph("<b>That created a mess:</b>", styles["BodyTight"]))
    story.append(
        bullets(
            [
                "Google and customers now see <b>two places</b>, not one clear home",
                "Your own sites are basically <b>competing against each other</b>",
                "After you stopped working with that company, they changed the site",
                "It now shows a <b>concrete company in Texas</b>, not your HVAC business",
                "Anyone who lands there sees the <b>wrong business, wrong city, wrong trade</b>",
            ],
            space_after=8,
        )
    )
    story.append(
        Paragraph(
            "What that means: people may find the wrong thing, trust gets broken, and old links or ads can send people to a dead end. You are paying for confusion instead of getting more jobs.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "Outcome of this project: one clear home online. Your name. Your trade. Your cities. No concrete company stealing your attention.",
            styles["Outcome"],
        )
    )

    story.append(PageBreak())

    story.append(Paragraph("What you get", styles["H2"]))
    story.append(section_rule())

    def item_block(title, intro, items, outcome, note=None):
        block = [Paragraph(title, styles["H3"])]
        if intro:
            block.append(Paragraph(intro, styles["BodyTight"]))
        if items:
            block.append(bullets(items, space_after=3))
        block.append(Paragraph(outcome, styles["Outcome"]))
        if note:
            block.append(Paragraph(note, styles["Small"]))
        return block

    left_items = [
        item_block(
            "1. One clean company website",
            "A modern How Much website for phones and computers - built for trust and quotes.",
            [
                "Home, services, cities, about, team, projects",
                "Blog, FAQs, booking / quote, financing",
                "Maintenance, warranty, second opinion",
                "Contact, reviews, partners, ads page",
            ],
            "Outcome: People land on the right site and ask for help.",
        ),
        item_block(
            "2. Fix the two-website problem",
            None,
            [
                "Make <b>trusthowmuch.com</b> the one true home",
                "Stop damage from the old subdomain site",
                "Redirects / cleanup when we can",
                "Get HVAC info in front of Google again",
            ],
            "Outcome: Your brand stops fighting itself online.",
        ),
        item_block(
            "3. Built to be found (SEO)",
            None,
            [
                "Sitemap and clean page structure",
                "City and service pages that can rank",
                "Blog SEO pieces",
            ],
            "Outcome: A better chance people searching for HVAC near you find you.",
            "Ranking takes time. This builds the foundation.",
        ),
        item_block(
            "4. Real customer portal",
            "Real logins for your customers - not a fake sample forever.",
            [
                "Jobs / projects, messages, documents",
                "Request service and pay invoices online",
            ],
            'Outcome: Fewer lost texts. Fewer "Where\'s my paperwork?" calls.',
        ),
    ]
    right_items = [
        item_block(
            "5. Real owner admin + AI helper",
            "Your private business control room.",
            [
                "Paid / unpaid / overdue money view",
                "Invoices, schedule, messages, leads",
                "AI helper for cash, jobs, and follow-ups",
            ],
            "Outcome: Run the business from one place.",
        ),
        item_block(
            "6. Real payments, texts, and emails",
            None,
            [
                "Online payments for invoices / deposits",
                "Text and email alerts for quotes and updates",
                "Messages tied to portal and admin",
            ],
            "Outcome: Customers pay easier. You chase less.",
        ),
        item_block(
            "7. Design that matches your brand",
            "Your How Much look - logo, colors, clean and trustworthy style.",
            [],
            "Outcome: Feels like your company, not a cheap template or someone else's concrete business.",
        ),
    ]

    get_table = Table(
        [[left_items, right_items]], colWidths=[3.5 * inch, 3.5 * inch]
    )
    get_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 14),
                ("LEFTPADDING", (1, 0), (1, 0), 14),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ]
        )
    )
    story.append(get_table)

    story.append(PageBreak())

    story.append(Paragraph("Price breakdown", styles["H2"]))
    story.append(section_rule())
    story.append(
        Paragraph(
            "These are normal fair prices for this kind of full custom build.",
            styles["Small"],
        )
    )

    rows = [
        [
            Paragraph("Piece", styles["CellBold"]),
            Paragraph("What you get", styles["CellBold"]),
            Paragraph("Normal price", styles["CellBold"]),
        ],
        [
            Paragraph("Main marketing website", styles["CellBold"]),
            Paragraph(
                "Full site: services, cities, about, team, blog, booking, trust pages",
                styles["Cell"],
            ),
            Paragraph("$8,500", styles["Cell"]),
        ],
        [
            Paragraph("Domain cleanup + SEO", styles["CellBold"]),
            Paragraph(
                "One true home on trusthowmuch.com + search setup", styles["Cell"]
            ),
            Paragraph("$2,500", styles["Cell"]),
        ],
        [
            Paragraph("Ads landing page", styles["CellBold"]),
            Paragraph("Page built to turn ad clicks into quotes", styles["Cell"]),
            Paragraph("$1,000", styles["Cell"]),
        ],
        [
            Paragraph("Real customer portal", styles["CellBold"]),
            Paragraph(
                "Real logins, jobs, docs, messages, service requests", styles["Cell"]
            ),
            Paragraph("$5,500", styles["Cell"]),
        ],
        [
            Paragraph("Real owner admin + AI", styles["CellBold"]),
            Paragraph(
                "Money, invoices, schedule, leads, AI helper", styles["Cell"]
            ),
            Paragraph("$5,000", styles["Cell"]),
        ],
        [
            Paragraph("Payments + texts/emails", styles["CellBold"]),
            Paragraph("Online pay + real SMS/email follow-ups", styles["Cell"]),
            Paragraph("$5,000", styles["Cell"]),
        ],
        [
            Paragraph("Normal total", styles["CellBold"]),
            Paragraph("Full package", styles["CellBold"]),
            Paragraph("$27,500", styles["CellBold"]),
        ],
        [
            Paragraph("Your family price", styles["CellBold"]),
            Paragraph("Same full package", styles["CellBold"]),
            Paragraph("$1,500", styles["CellBold"]),
        ],
    ]
    table = Table(rows, colWidths=[2.2 * inch, 3.85 * inch, 1.15 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), LIGHT),
                ("BACKGROUND", (0, 7), (-1, 7), LIGHT),
                ("BACKGROUND", (0, 8), (-1, 8), FAMILY_BG),
                ("TEXTCOLOR", (0, 8), (-1, 8), LINK),
                ("LINEABOVE", (0, 0), (-1, 0), 1, LINE),
                ("LINEBELOW", (0, 0), (-1, -1), 1, LINE),
                ("LINEBELOW", (0, 8), (-1, 8), 2, RED),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("ALIGN", (2, 0), (2, -1), "RIGHT"),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 8))

    story.append(
        Paragraph(
            "<b>Why the normal price is that high:</b> This is not one pretty page. It is a full website, domain cleanup, customer portal, owner admin, payments, texts/emails, and AI - all built around your brand and real day-to-day work.",
            styles["Small"],
        )
    )
    story.append(Spacer(1, 8))

    inc = [
        Paragraph("What is included", styles["H2"]),
        section_rule(),
        bullets(
            [
                "Everything listed above",
                "Launch on <b>trusthowmuch.com</b>",
                "Real customer logins",
                "Real payments",
                "Real texts and emails",
                "Owner admin + AI helper",
                "Help cleaning up the old competing site problem",
                "A walkthrough so you know how to use it",
            ],
            space_after=4,
        ),
    ]
    exc = [
        Paragraph("What is not included", styles["H2"]),
        section_rule(),
        Paragraph(
            "These are ongoing costs, not the build itself:", styles["BodyTight"]
        ),
        bullets(
            [
                "Paying for ads every month",
                "Monthly SEO retainers after launch",
                "Monthly text / email / payment processing fees from those companies",
                "Unlimited redesigns forever after launch",
            ],
            space_after=4,
        ),
    ]
    two = Table([[inc, exc]], colWidths=[3.5 * inch, 3.5 * inch])
    two.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 14),
                ("LEFTPADDING", (1, 0), (1, 0), 14),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ]
        )
    )
    story.append(two)
    story.append(Spacer(1, 10))

    success_col = [
        Paragraph("What success looks like", styles["H2"]),
        section_rule(),
        numbered(
            [
                "People find the right How Much website.",
                "The old wrong site stops confusing customers.",
                "People can ask for a quote easily.",
                "Customers can log in, see their job, and pay.",
                "You see money, jobs, and messages in one place.",
                "Texts and emails help you follow up cleanly.",
            ]
        ),
    ]
    next_col = [
        Paragraph("Next steps", styles["H2"]),
        section_rule(),
        numbered(
            [
                "You review this proposal.",
                "You say yes to the <b>$1,500</b> family price.",
                "We launch on <b>trusthowmuch.com</b>.",
                "We clean up the two-site confusion.",
                "We turn on portal, payments, texts, and emails.",
                "We do a short walkthrough together.",
            ]
        ),
    ]
    success_next = Table(
        [[success_col, next_col]], colWidths=[3.5 * inch, 3.5 * inch]
    )
    success_next.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (0, 0), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 14),
                ("LEFTPADDING", (1, 0), (1, 0), 14),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
            ]
        )
    )
    story.append(success_next)
    story.append(Spacer(1, 8))

    close = [
        Paragraph(
            "<b>Payment: Total due $1,500</b> &nbsp;&nbsp;|&nbsp;&nbsp; Pay however you prefer (Zelle, cash app, check, or whatever we agree on).",
            styles["BodyTight"],
        ),
        Spacer(1, 6),
        Paragraph(
            'Your current setup is not just "old." It is actively working against you. Two websites. Wrong business info. Wrong trade. Wrong state. This project gives you one clear home online - plus the real tools to run jobs, get paid, and follow up.',
            styles["Small"],
        ),
        Paragraph(
            "I am not charging you what this is worth on the open market. I <i>am</i> showing you the real number so you know the value. Questions? Happy to walk through it page by page.",
            styles["Small"],
        ),
        Paragraph("- Milton", styles["Meta"]),
    ]
    pay = Table([[close]], colWidths=[7.2 * inch])
    pay.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 1.5, HexColor("#222222")),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 10),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(pay)

    doc = SimpleDocTemplate(
        OUT,
        pagesize=letter,
        leftMargin=0.65 * inch,
        rightMargin=0.65 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Website Proposal for Andy",
        author="Milton",
    )
    doc.build(story)

    from pypdf import PdfReader

    reader = PdfReader(OUT)
    page1 = reader.pages[0].extract_text()
    assert "Andy?" not in page1
    assert "For: Andy" in page1.replace("\n", " ")
    print(f"Wrote {OUT} ({len(reader.pages)} pages)")
    print(page1.splitlines()[2])


if __name__ == "__main__":
    build()
