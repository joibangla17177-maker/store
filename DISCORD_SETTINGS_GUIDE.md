# Discord Server Settings - Admin Panel Guide

## Overview
A new **Discord Server** tab has been added to the Admin Panel, allowing admins to easily manage and update the Discord server invite link displayed throughout the application.

## Features

### 1. **Update Discord Invite Link**
- Enter your Discord server's invite link
- Supports both formats:
  - `https://discord.gg/CODE`
  - `https://discord.com/invite/CODE`

### 2. **Link Validation**
- Automatically validates the link format
- Shows error messages for invalid links
- Ensures link starts with the correct Discord domain

### 3. **Quick Actions**
- **Copy Link**: One-click copy to clipboard
- **Open Discord**: Direct button to open Discord server
- **Preview**: See how the Discord invite will appear in the app

### 4. **Persistent Storage**
- Settings are saved to `store_data.json`
- Changes take effect immediately
- No deployment needed after updating

## How to Use

### Step 1: Access Discord Settings
1. Log into the **Admin Panel**
2. Click **Discord Server** in the sidebar menu

### Step 2: Enter Your Discord Link
1. Find your Discord server's invite link:
   - In Discord: Server Settings → Invite
   - Generate a link: "Create Invite"
   - Copy the invite link
   
2. In the Admin Panel, paste the link in the **Invite URL** field

### Step 3: Test the Link
- Click the **Open Discord Server** button to verify the link works
- The preview will show how it appears in the app

### Step 4: Save
- Click **Save Discord Link** button
- You'll see a confirmation: "Saved!"
- The change takes effect immediately

## Example Discord Links
```
https://discord.gg/forbiden
https://discord.gg/abc123xyz
https://discord.com/invite/forbiden
```

## File Changes
The Discord link is stored in:
- **Database**: `store_data.json` → `discordInviteLink` field
- **API Endpoint**: `/api/admin/settings/update` (POST)
- **Getter Endpoint**: `/api/settings` (GET)

## Components Added

### Frontend
- `src/components/admin/AdminDiscordSettings.tsx` - New settings component
- Updated `src/components/admin/AdminSidebar.tsx` - Added Discord menu item
- Updated `src/components/admin/AdminPanel.tsx` - Added Discord tab routing

### Backend
- Updated `server/api.ts` - Added `/admin/settings/update` endpoint
- Updated `server/db.ts` - Added Discord link persistence methods

## Technical Details

### API Endpoints

#### Get Settings
```
GET /api/settings
Response:
{
  "success": true,
  "settings": {
    "discordInviteLink": "https://discord.gg/forbiden",
    ...otherSettings
  }
}
```

#### Update Settings
```
POST /api/admin/settings/update
Body: { "discordInviteLink": "https://discord.gg/your-code" }
Response:
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": { ... }
}
```

## Best Practices

✅ **DO:**
- Use "Never Expire" option when generating Discord invite links
- Test links before saving
- Keep Discord invite updated when migrating servers
- Use consistent, branded Discord server invites

❌ **DON'T:**
- Leave the field empty
- Use invalid link formats
- Share personal Discord links
- Use temporary/expiring invites

## Troubleshooting

### Link Not Saving?
- Check that the link is valid and accessible
- Ensure the link starts with `https://discord.gg/` or `https://discord.com/invite/`
- Check browser console for error messages

### Users Can't Join?
- Verify the Discord link is still active
- Check Discord server permissions
- Ensure the invite is public

### Changes Not Showing?
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Check that save confirmation appeared

## Integration Points

The Discord link is used in:
1. **Homepage** - Community join button
2. **Footer** - Support/community links
3. **Support Pages** - Community assistance options
4. **User Profiles** - Community links
5. **App Details** - Get help/community section

When you update the Discord link, all these areas will automatically use the new link on next page load.
