# Investor dashboard — design notes (agreed)

- Personal dashboard. Each investor sees only their own projects, with their own amount per project.
- No notice board. Removed from the dashboard.
- Slim strip "অন্যান্য চলমান প্রজেক্ট": names and sector of company projects the investor is not in. Collapsed by default. Names only, no amounts.
- Project cards: one uniform look. Photo from `investor_projects.image_url` when set, otherwise a gradient with the project initial.
- Six overview tiles, each with its own corporate gradient and a staggered entrance animation.
- Read-only details section (passport style): name, first/last name, father's name, passport number, address, nominee details. Investor cannot edit.
- Documents are visible to the investment owner, no unlock step.
- Admin portal (`/#/admin/portal`) uses the same theme.

Pending from the owner: project photos (Makkah/Madinah, hotel, Oman project, investor licence, Umrah supermarket, Icon, Lazeez Club). Paste the image links and they will show on the cards.
