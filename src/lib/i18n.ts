
export type Locale = "en" | "uk" | "pl" | "de" | "es" | "fr" | "it" | "pt";

const MESSAGES: Record<Locale, Record<string, string>> = {
  en: {
    // Navbar
    "navbar.planner": "Planner",
    "navbar.posts": "Posts",
    "navbar.channels": "Channels",
    "navbar.calendar": "Calendar",
    "navbar.integrations": "Integrations",
    "navbar.members": "Members",
    "navbar.signIn": "Sign in",
    "navbar.signOut": "Sign out",

    // Planner
    "planner.subtitle": "Plan posts for your channels.",
    "button.newPost": "New Post",

    // Calendar
    "calendar.title": "Calendar",
    "calendar.subtitle": "Plan and reschedule posts by day.",

    // Channels
    "channels.title": "Channels",
    "channels.subtitle": "Manage available posting channels.",
    "channels.new": "New channel",
    "channels.add": "Add",
    "channels.name": "Name",
    "channels.actions": "Actions",
    "channels.edit": "Edit",
    "channels.cancel": "Cancel",
    "channels.delete": "Delete",
    "channels.empty": "No channels yet.",

    // Generic
    "select.placeholder": "SelectР Р†Р вЂљР’В¦",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.edit": "Edit",
    "action.quickEdit": "Quick Edit",
    "action.duplicate": "Duplicate",
    "action.delete": "Delete",
    "action.undo": "Undo",
    "action.publish": "Publish",
    "action.close": "Close",

    // Posts
    "posts.title": "Posts",
    "posts.subtitle": "List of scheduled and published posts.",
    "filters.channel": "Channel",
    "filters.status": "Status",
    "filters.allStatuses": "All statuses",
    "filters.title": "Title",
    "filters.searchPlaceholder": "Search titleР Р†Р вЂљР’В¦",
    "table.date": "Date",
    "table.channel": "Channel",
    "table.title": "Title",
    "table.status": "Status",
    "table.actions": "Actions",
    "table.noPosts": "No posts yet.",
    "table.noMatches": "No posts match your filters.",
    "table.clearFilters": "Clear filters",
    "table.createPost": "Create a post",
    "table.newPost": "New Post",
    "confirm.deletePost": "Delete this post?",
    "toast.saved": "Saved",
    "toast.deleted": "Deleted",
    "toast.duplicated": "Duplicated",
    "toast.published": "Published",
    "error.quotaPostsExceeded": "Monthly post limit reached.",

    // Pagination
    "pagination.prev": "Prev",
    "pagination.next": "Next",

    // Import/Export
    "importExport.exportJson": "Export JSON",
    "importExport.importJson": "Import JSON",
    "importExport.exportCsv": "Export CSV",
    "importExport.importCsv": "Import CSV",
    "importExport.invalidFile": "Invalid file format",
    "importExport.invalidCsv": "Invalid CSV (check headers and values)",
    "importExport.readError": "Failed to read file",

    // Channels confirm
    "confirm.deleteChannel": "Delete this channel?",

    // New Post Modal
    "newPost.titleNew": "New Post",
    "newPost.titleEdit": "Edit Post",
    "newPost.subtitle": "Fill in the details below.",
    "newPost.channel": "Channel",
    "newPost.status": "Status",
    "newPost.datetime": "Date & Time",
    "newPost.titleLabel": "Title",
    "newPost.titlePlaceholder": "Post titleР Р†Р вЂљР’В¦",
    "newPost.contentLabel": "Content",
    "newPost.contentPlaceholder": "Optional contentР Р†Р вЂљР’В¦",
    "newPost.mediaLabel": "Media URLs",
    "newPost.mediaPlaceholder": "https://Р Р†Р вЂљР’В¦",
    "error.required": "Required",

    // Day modal
    "day.tip": "Tip: drag a post onto a time to reschedule.",
    "day.noPosts": "No posts for this day.",
    "day.quick": "Quick",
    "day.tz": "TZ",
    "day.rescheduled": "Rescheduled",

    // Preview
    "preview.title": "Preview",
    "preview.copy": "Copy",
    "preview.copied": "Copied!",
    "media.reorderHint": "Drag or use arrow keys to reorder",
    "posts.back": "Back to Posts",
    "posts.untitled": "Untitled",
    "post.editTitle": "Edit Post",
    "post.notFound": "Post not found",

    // Integrations
    "integrations.title": "Integrations",
    "integrations.subtitle": "Connect third-party services.",
    "integrations.telegram": "Telegram",
    "integrations.telegramSubtitle": "Connect a bot to simulate sending on publish.",
    "integrations.botToken": "Bot token",
    "integrations.chatId": "Chat ID",
    "integrations.connect": "Connect",
    "integrations.disconnect": "Disconnect",
    "integrations.connected": "Connected",
    "integrations.disconnected": "Disconnected",
    "integrations.postId": "Post ID",
    "integrations.sendTest": "Send test + Publish",
    "integrations.sentPublished": "Sent and published",
    "integrations.sendFailed": "Failed to send",

    // Settings
    "settings.title": "Settings",
    "settings.back": "Р Р†РІР‚В РЎвЂ™ Back",
    "settings.timezone": "Timezone",
    "settings.note": "Note: Currently this affects quick-time presets only; full timezone handling coming next.",
    "settings.quickTimes": "Quick times",
    "settings.remove": "Remove",
    "settings.addTime": "Add time",
    "settings.save": "Save Settings",
    "settings.useBrowserTz": "Use browser TZ",
    "settings.plan": "Plan",
    "settings.planHelp": "Affects quotas like posts/month.",
    "settings.planUpdated": "Plan updated",
    "settings.planUpdateFailed": "Failed to update plan",

    // Members
    "members.title": "Members",
    "members.subtitle": "Manage workspace members and roles.",
    "members.invite": "Invite Member",
    "members.inviteTitle": "Invite Member",
    "members.inviteDesc": "Enter an email to invite to this workspace.",
    "members.sendInvite": "Send Invite",
    "members.inviteFailed": "Failed to invite",
    "members.inviteSent": "Invite sent",
    "members.search": "Search",
    "members.searchPlaceholder": "Search by email",
    "members.total": "total",
    "members.email": "Email",
    "members.role": "Role",
    "members.actions": "Actions",
    "members.remove": "Remove",
    "members.confirmRemove": "Remove this member?",
    "members.removeFailed": "Failed to remove",
    "members.removed": "Removed",
    "members.cannotRemoveLastOwner": "Cannot remove last owner",
    "members.manageDisabled": "Only admins or owners can manage members",
    "members.inviteDisabled": "Only admins or owners can invite",
    "members.roleDisabled": "Only admins or owners can change roles",
    "members.roleUpdated": "Role updated",
    "members.roleFailed": "Failed to change role",
    "members.empty": "No members found.",
    "members.emailPlaceholder": "name@example.com",
  },
  uk: {
    "navbar.planner": "Р В РЎСџР В Р’В»Р В Р’В°Р В Р вЂ¦Р В Р’ВµР РЋР вЂљ",
    "navbar.posts": "Р В РЎСџР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ",
    "navbar.channels": "Р В РЎв„ўР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»Р В РЎвЂ",
    "navbar.calendar": "Р В РЎв„ўР В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РўвЂР В Р’В°Р РЋР вЂљ",
    "navbar.integrations": "Р В РІР‚В Р В Р вЂ¦Р РЋРІР‚С™Р В Р’ВµР В РЎвЂ“Р РЋР вЂљР В Р’В°Р РЋРІР‚В Р РЋРІР‚вЂњР РЋРІР‚вЂќ",
    "navbar.members": "Р В Р в‚¬Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В РЎвЂ",
    "navbar.signIn": "Р В Р в‚¬Р В Р вЂ Р РЋРІР‚вЂњР В РІвЂћвЂ“Р РЋРІР‚С™Р В РЎвЂ",
    "navbar.signOut": "Р В РІР‚в„ўР В РЎвЂР В РІвЂћвЂ“Р РЋРІР‚С™Р В РЎвЂ",
    "planner.subtitle": "Р В РЎСџР В Р’В»Р В Р’В°Р В Р вЂ¦Р РЋРЎвЂњР В РІвЂћвЂ“Р РЋРІР‚С™Р В Р’Вµ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ Р В РўвЂР В Р’В»Р РЋР РЏ Р В Р вЂ Р В Р’В°Р РЋРІвЂљВ¬Р В РЎвЂР РЋРІР‚В¦ Р В РЎвЂќР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»Р РЋРІР‚вЂњР В Р вЂ .",
    "button.newPost": "Р В РЎСљР В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™",
    "calendar.title": "Р В РЎв„ўР В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РўвЂР В Р’В°Р РЋР вЂљ",
    "calendar.subtitle": "Р В РЎСџР В Р’В»Р В Р’В°Р В Р вЂ¦Р РЋРЎвЂњР В РІвЂћвЂ“Р РЋРІР‚С™Р В Р’Вµ Р РЋРІР‚С™Р В Р’В° Р В РЎвЂ”Р В Р’ВµР РЋР вЂљР В Р’ВµР В Р вЂ¦Р В РЎвЂўР РЋР С“Р РЋРІР‚вЂњР РЋРІР‚С™Р РЋР Р‰ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ Р В РЎвЂ”Р В РЎвЂў Р В РўвЂР В Р вЂ¦Р РЋР РЏР РЋРІР‚В¦.",
    "channels.title": "Р В РЎв„ўР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»Р В РЎвЂ",
    "channels.subtitle": "Р В РЎв„ўР В Р’ВµР РЋР вЂљР РЋРЎвЂњР В РІвЂћвЂ“Р РЋРІР‚С™Р В Р’Вµ Р В РўвЂР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРЎвЂњР В РЎвЂ”Р В Р вЂ¦Р В РЎвЂР В РЎВР В РЎвЂ Р В РЎвЂќР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»Р В Р’В°Р В РЎВР В РЎвЂ Р В РЎвЂ”Р РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋРІР‚вЂњР В РЎвЂќР В Р’В°Р РЋРІР‚В Р РЋРІР‚вЂњР В РІвЂћвЂ“.",
    "channels.new": "Р В РЎСљР В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂќР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»",
    "channels.add": "Р В РІР‚СњР В РЎвЂўР В РўвЂР В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "channels.name": "Р В РЎСљР В Р’В°Р В Р’В·Р В Р вЂ Р В Р’В°",
    "channels.actions": "Р В РІР‚СњР РЋРІР‚вЂњР РЋРІР‚вЂќ",
    "channels.edit": "Р В Р’В Р В Р’ВµР В РўвЂР В Р’В°Р В РЎвЂ“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "channels.cancel": "Р В Р Р‹Р В РЎвЂќР В Р’В°Р РЋР С“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "channels.delete": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "channels.empty": "Р В Р’В©Р В Р’Вµ Р В Р вЂ¦Р В Р’ВµР В РЎВР В Р’В°Р РЋРІР‚Сњ Р В РЎвЂќР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»Р РЋРІР‚вЂњР В Р вЂ .",
    "select.placeholder": "Р В РЎвЂєР В Р’В±Р В Р’ВµР РЋР вЂљР РЋРІР‚вЂњР РЋРІР‚С™Р РЋР Р‰Р Р†Р вЂљР’В¦",
    "action.save": "Р В РІР‚вЂќР В Р’В±Р В Р’ВµР РЋР вЂљР В Р’ВµР В РЎвЂ“Р РЋРІР‚С™Р В РЎвЂ",
    "action.cancel": "Р В Р Р‹Р В РЎвЂќР В Р’В°Р РЋР С“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "action.edit": "Р В Р’В Р В Р’ВµР В РўвЂР В Р’В°Р В РЎвЂ“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "action.quickEdit": "Р В Р РѓР В Р вЂ Р В РЎвЂР В РўвЂР В РЎвЂќР В Р’Вµ Р РЋР вЂљР В Р’ВµР В РўвЂР В Р’В°Р В РЎвЂ“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ",
    "action.duplicate": "Р В РІР‚СњР РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋР вЂ№Р В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "action.delete": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "action.undo": "Р В РЎСџР В РЎвЂўР В Р вЂ Р В Р’ВµР РЋР вЂљР В Р вЂ¦Р РЋРЎвЂњР РЋРІР‚С™Р В РЎвЂ",
    "action.publish": "Р В РЎвЂєР В РЎвЂ”Р РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋРІР‚вЂњР В РЎвЂќР РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "action.close": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂќР РЋР вЂљР В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "posts.title": "Р В РЎСџР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ",
    "posts.subtitle": "Р В Р Р‹Р В РЎвЂ”Р В РЎвЂР РЋР С“Р В РЎвЂўР В РЎвЂќ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р В Р’В»Р В Р’В°Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂР РЋРІР‚В¦ Р РЋРІР‚С™Р В Р’В° Р В РЎвЂўР В РЎвЂ”Р РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋРІР‚вЂњР В РЎвЂќР В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂР РЋРІР‚В¦ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРІР‚вЂњР В Р вЂ .",
    "filters.channel": "Р В РЎв„ўР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»",
    "filters.status": "Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“",
    "filters.allStatuses": "Р В Р в‚¬Р РЋР С“Р РЋРІР‚вЂњ Р РЋР С“Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“Р В РЎвЂ",
    "filters.title": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РЎвЂќ",
    "filters.searchPlaceholder": "Р В РЎСџР В РЎвЂўР РЋРІвЂљВ¬Р РЋРЎвЂњР В РЎвЂќ Р В Р’В·Р В Р’В° Р В Р’В·Р В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂќР В РЎвЂўР В РЎВР Р†Р вЂљР’В¦",
    "table.date": "Р В РІР‚СњР В Р’В°Р РЋРІР‚С™Р В Р’В°",
    "table.channel": "Р В РЎв„ўР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»",
    "table.title": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РЎвЂќ",
    "table.status": "Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“",
    "table.actions": "Р В РІР‚СњР РЋРІР‚вЂњР РЋРІР‚вЂќ",
    "table.noPosts": "Р В РЎСџР В РЎвЂўР В РЎвЂќР В РЎвЂ Р В Р вЂ¦Р В Р’ВµР В РЎВР В Р’В°Р РЋРІР‚Сњ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРІР‚вЂњР В Р вЂ .",
    "table.noMatches": "Р В РЎСљР В Р’Вµ Р В Р’В·Р В Р вЂ¦Р В Р’В°Р В РІвЂћвЂ“Р В РўвЂР В Р’ВµР В Р вЂ¦Р В РЎвЂў Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРІР‚вЂњР В Р вЂ  Р В Р’В·Р В Р’В° Р РЋРІР‚С›Р РЋРІР‚вЂњР В Р’В»Р РЋР Р‰Р РЋРІР‚С™Р РЋР вЂљР В Р’В°Р В РЎВР В РЎвЂ.",
    "table.clearFilters": "Р В Р Р‹Р В РЎвЂќР В РЎвЂР В Р вЂ¦Р РЋРЎвЂњР РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚С›Р РЋРІР‚вЂњР В Р’В»Р РЋР Р‰Р РЋРІР‚С™Р РЋР вЂљР В РЎвЂ",
    "table.createPost": "Р В Р Р‹Р РЋРІР‚С™Р В Р вЂ Р В РЎвЂўР РЋР вЂљР В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™",
    "table.newPost": "Р В РЎСљР В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™",
    "confirm.deletePost": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚В Р В Р’ВµР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™?",
    "toast.saved": "Р В РІР‚вЂќР В Р’В±Р В Р’ВµР РЋР вЂљР В Р’ВµР В Р’В¶Р В Р’ВµР В Р вЂ¦Р В РЎвЂў",
    "toast.deleted": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў",
    "toast.duplicated": "Р В РІР‚СњР РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋР Р‰Р В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂў",
    "toast.published": "Р В РЎвЂєР В РЎвЂ”Р РЋРЎвЂњР В Р’В±Р В Р’В»Р РЋРІР‚вЂњР В РЎвЂќР В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂў",
    "error.quotaPostsExceeded": "Р В РІР‚СњР В РЎвЂўР РЋР С“Р РЋР РЏР В РЎвЂ“Р В Р вЂ¦Р РЋРЎвЂњР РЋРІР‚С™Р В РЎвЂў Р В РЎВР РЋРІР‚вЂњР РЋР С“Р РЋР РЏР РЋРІР‚РЋР В Р вЂ¦Р В РЎвЂР В РІвЂћвЂ“ Р В Р’В»Р РЋРІР‚вЂњР В РЎВР РЋРІР‚вЂњР РЋРІР‚С™ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРІР‚вЂњР В Р вЂ .",
    "pagination.prev": "Р В РЎСљР В Р’В°Р В Р’В·Р В Р’В°Р В РўвЂ",
    "pagination.next": "Р В РІР‚СњР В Р’В°Р В Р’В»Р РЋРІР‚вЂњ",
    "importExport.exportJson": "Р В РІР‚СћР В РЎвЂќР РЋР С“Р В РЎвЂ”Р В РЎвЂўР РЋР вЂљР РЋРІР‚С™ JSON",
    "importExport.importJson": "Р В РІР‚В Р В РЎВР В РЎвЂ”Р В РЎвЂўР РЋР вЂљР РЋРІР‚С™ JSON",
    "importExport.exportCsv": "Р В РІР‚СћР В РЎвЂќР РЋР С“Р В РЎвЂ”Р В РЎвЂўР РЋР вЂљР РЋРІР‚С™ CSV",
    "importExport.importCsv": "Р В РІР‚В Р В РЎВР В РЎвЂ”Р В РЎвЂўР РЋР вЂљР РЋРІР‚С™ CSV",
    "importExport.invalidFile": "Р В РЎСљР В Р’ВµР В Р вЂ Р РЋРІР‚вЂњР РЋР вЂљР В Р вЂ¦Р В РЎвЂР В РІвЂћвЂ“ Р РЋРІР‚С›Р В РЎвЂўР РЋР вЂљР В РЎВР В Р’В°Р РЋРІР‚С™ Р РЋРІР‚С›Р В Р’В°Р В РІвЂћвЂ“Р В Р’В»Р РЋРЎвЂњ",
    "importExport.invalidCsv": "Р В РЎСљР В Р’ВµР В Р вЂ Р РЋРІР‚вЂњР РЋР вЂљР В Р вЂ¦Р В РЎвЂР В РІвЂћвЂ“ CSV (Р В РЎвЂ”Р В Р’ВµР РЋР вЂљР В Р’ВµР В Р вЂ Р РЋРІР‚вЂњР РЋР вЂљР РЋРІР‚С™Р В Р’Вµ Р В Р’В·Р В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂќР В РЎвЂ Р РЋРІР‚С™Р В Р’В° Р В Р’В·Р В Р вЂ¦Р В Р’В°Р РЋРІР‚РЋР В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ)",
    "importExport.readError": "Р В РЎСљР В Р’Вµ Р В Р вЂ Р В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂўР РЋР С“Р РЋР РЏ Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІР‚РЋР В РЎвЂР РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚С›Р В Р’В°Р В РІвЂћвЂ“Р В Р’В»",
    "confirm.deleteChannel": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚В Р В Р’ВµР В РІвЂћвЂ“ Р В РЎвЂќР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»?",
    "newPost.titleNew": "Р В РЎСљР В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™",
    "newPost.titleEdit": "Р В Р’В Р В Р’ВµР В РўвЂР В Р’В°Р В РЎвЂ“Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™",
    "newPost.subtitle": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ”Р В РЎвЂўР В Р вЂ Р В Р вЂ¦Р РЋРІР‚вЂњР РЋРІР‚С™Р РЋР Р‰ Р В РўвЂР В Р’В°Р В Р вЂ¦Р РЋРІР‚вЂњ Р В Р вЂ¦Р В РЎвЂР В Р’В¶Р РЋРІР‚РЋР В Р’Вµ.",
    "newPost.channel": "Р В РЎв„ўР В Р’В°Р В Р вЂ¦Р В Р’В°Р В Р’В»",
    "newPost.status": "Р В Р Р‹Р РЋРІР‚С™Р В Р’В°Р РЋРІР‚С™Р РЋРЎвЂњР РЋР С“",
    "newPost.datetime": "Р В РІР‚СњР В Р’В°Р РЋРІР‚С™Р В Р’В° Р РЋРІР‚вЂњ Р РЋРІР‚РЋР В Р’В°Р РЋР С“",
    "newPost.titleLabel": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РЎвЂќ",
    "newPost.titlePlaceholder": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ“Р В РЎвЂўР В Р’В»Р В РЎвЂўР В Р вЂ Р В РЎвЂўР В РЎвЂќ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В Р’В°Р Р†Р вЂљР’В¦",
    "newPost.contentLabel": "Р В РЎв„ўР В РЎвЂўР В Р вЂ¦Р РЋРІР‚С™Р В Р’ВµР В Р вЂ¦Р РЋРІР‚С™",
    "newPost.contentPlaceholder": "Р В РЎСљР В Р’ВµР В РЎвЂўР В Р’В±Р В РЎвЂўР В Р вЂ 'Р РЋР РЏР В Р’В·Р В РЎвЂќР В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂќР В РЎвЂўР В Р вЂ¦Р РЋРІР‚С™Р В Р’ВµР В Р вЂ¦Р РЋРІР‚С™Р Р†Р вЂљР’В¦",
    "newPost.mediaLabel": "Р В РЎС™Р В Р’ВµР В РўвЂР РЋРІР‚вЂњР В Р’В°-URL",
    "newPost.mediaPlaceholder": "https://Р Р†Р вЂљР’В¦",
    "error.required": "Р В РЎвЂєР В Р’В±Р В РЎвЂўР В Р вЂ Р Р†Р вЂљРІвЂћСћР РЋР РЏР В Р’В·Р В РЎвЂќР В РЎвЂўР В Р вЂ Р В РЎвЂў",
    "day.tip": "Р В РЎСџР РЋРІР‚вЂњР В РўвЂР В РЎвЂќР В Р’В°Р В Р’В·Р В РЎвЂќР В Р’В°: Р В РЎвЂ”Р В Р’ВµР РЋР вЂљР В Р’ВµР РЋРІР‚С™Р РЋР РЏР В РЎвЂ“Р В Р вЂ¦Р РЋРІР‚вЂњР РЋРІР‚С™Р РЋР Р‰ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™ Р В Р вЂ¦Р В Р’В° Р РЋРІР‚РЋР В Р’В°Р РЋР С“, Р РЋРІР‚В°Р В РЎвЂўР В Р’В± Р В Р’В·Р В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋР вЂљР В РЎвЂўР В Р’В·Р В РЎвЂќР В Р’В»Р В Р’В°Р В РўвЂ.",
    "day.noPosts": "Р В РЎСљР В Р’В° Р РЋРІР‚В Р В Р’ВµР В РІвЂћвЂ“ Р В РўвЂР В Р’ВµР В Р вЂ¦Р РЋР Р‰ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р РЋРІР‚вЂњР В Р вЂ  Р В Р вЂ¦Р В Р’ВµР В РЎВР В Р’В°Р РЋРІР‚Сњ.",
    "day.quick": "Р В Р РѓР В Р вЂ Р В РЎвЂР В РўвЂР В РЎвЂќР В РЎвЂў",
    "day.tz": "TZ",
    "day.rescheduled": "Р В РЎСџР В Р’ВµР РЋР вЂљР В Р’ВµР В РЎвЂ”Р В Р’В»Р В Р’В°Р В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂў",
    "preview.title": "Р В РЎСџР В РЎвЂўР В РЎвЂ”Р В Р’ВµР РЋР вЂљР В Р’ВµР В РўвЂР В Р вЂ¦Р РЋРІР‚вЂњР В РІвЂћвЂ“ Р В РЎвЂ”Р В Р’ВµР РЋР вЂљР В Р’ВµР В РЎвЂ“Р В Р’В»Р РЋР РЏР В РўвЂ",
    "preview.copy": "Р В РЎв„ўР В РЎвЂўР В РЎвЂ”Р РЋРІР‚вЂњР РЋР вЂ№Р В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "preview.copied": "Р В Р Р‹Р В РЎвЂќР В РЎвЂўР В РЎвЂ”Р РЋРІР‚вЂњР В РІвЂћвЂ“Р В РЎвЂўР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В РЎвЂў!",
    "settings.title": "Р В РЎСљР В Р’В°Р В Р’В»Р В Р’В°Р РЋРІвЂљВ¬Р РЋРІР‚С™Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ",
    "settings.back": "Р Р†РІР‚В РЎвЂ™ Р В РЎСљР В Р’В°Р В Р’В·Р В Р’В°Р В РўвЂ",
    "settings.timezone": "Р В Р’В§Р В Р’В°Р РЋР С“Р В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР РЏР РЋР С“",
    "settings.note": "Р В РЎСџР РЋР вЂљР В РЎвЂР В РЎВР РЋРІР‚вЂњР РЋРІР‚С™Р В РЎвЂќР В Р’В°: Р В Р’В·Р В Р’В°Р РЋР вЂљР В Р’В°Р В Р’В· Р РЋРІР‚В Р В Р’Вµ Р В Р вЂ Р В РЎвЂ”Р В Р’В»Р В РЎвЂР В Р вЂ Р В Р’В°Р РЋРІР‚Сњ Р В Р’В»Р В РЎвЂР РЋРІвЂљВ¬Р В Р’Вµ Р В Р вЂ¦Р В Р’В° Р РЋРІвЂљВ¬Р В Р вЂ Р В РЎвЂР В РўвЂР В РЎвЂќР РЋРІР‚вЂњ Р В РЎвЂ”Р РЋР вЂљР В Р’ВµР РЋР С“Р В Р’ВµР РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р РЋРЎвЂњ; Р В РЎвЂ”Р В РЎвЂўР В Р вЂ Р В Р вЂ¦Р В Р’В° Р В РЎвЂ”Р РЋРІР‚вЂњР В РўвЂР РЋРІР‚С™Р РЋР вЂљР В РЎвЂР В РЎВР В РЎвЂќР В Р’В° Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В РЎвЂўР В Р вЂ Р В РЎвЂР РЋРІР‚В¦ Р В РЎвЂ”Р В РЎвЂўР РЋР РЏР РЋР С“Р РЋРІР‚вЂњР В Р вЂ  Р Р†Р вЂљРІР‚Сњ Р В РўвЂР В Р’В°Р В Р’В»Р РЋРІР‚вЂњ.",
    "settings.quickTimes": "Р В Р РѓР В Р вЂ Р В РЎвЂР В РўвЂР В РЎвЂќР РЋРІР‚вЂњ Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В РЎвЂ",
    "settings.remove": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "settings.addTime": "Р В РІР‚СњР В РЎвЂўР В РўвЂР В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚РЋР В Р’В°Р РЋР С“",
    "settings.save": "Р В РІР‚вЂќР В Р’В±Р В Р’ВµР РЋР вЂљР В Р’ВµР В РЎвЂ“Р РЋРІР‚С™Р В РЎвЂ Р В Р вЂ¦Р В Р’В°Р В Р’В»Р В Р’В°Р РЋРІвЂљВ¬Р РЋРІР‚С™Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ",
    "settings.useBrowserTz": "Р В РІР‚в„ўР В РЎвЂР В РЎвЂќР В РЎвЂўР РЋР вЂљР В РЎвЂР РЋР С“Р РЋРІР‚С™Р В РЎвЂўР В Р вЂ Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В РЎвЂўР В Р вЂ Р В РЎвЂР В РІвЂћвЂ“ Р В РЎвЂ”Р В РЎвЂўР РЋР РЏР РЋР С“ Р В Р’В±Р РЋР вЂљР В Р’В°Р РЋРЎвЂњР В Р’В·Р В Р’ВµР РЋР вЂљР В Р’В°",
    "settings.plan": "Р В РЎСџР В Р’В»Р В Р’В°Р В Р вЂ¦",
    "settings.planHelp": "Р В РІР‚в„ўР В РЎвЂ”Р В Р’В»Р В РЎвЂР В Р вЂ Р В Р’В°Р РЋРІР‚Сњ Р В Р вЂ¦Р В Р’В° Р В Р’В»Р РЋРІР‚вЂњР В РЎВР РЋРІР‚вЂњР РЋРІР‚С™Р В РЎвЂ, Р РЋР РЏР В РЎвЂќ-Р В РЎвЂўР РЋРІР‚С™ Р В РЎвЂ”Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂ/Р В РЎВР РЋРІР‚вЂњР РЋР С“Р РЋР РЏР РЋРІР‚В Р РЋР Р‰.",
    "settings.planUpdated": "Р В РЎСџР В Р’В»Р В Р’В°Р В Р вЂ¦ Р В РЎвЂўР В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў",
    "settings.planUpdateFailed": "Р В РЎСљР В Р’Вµ Р В Р вЂ Р В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂўР РЋР С“Р РЋР РЏ Р В РЎвЂўР В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р В РЎвЂ”Р В Р’В»Р В Р’В°Р В Р вЂ¦",
    "members.title": "Р В Р в‚¬Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В РЎвЂ",
    "members.subtitle": "Р В РЎв„ўР В Р’ВµР РЋР вЂљР РЋРЎвЂњР В Р вЂ Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°Р В РЎВР В РЎвЂ Р РЋР вЂљР В РЎвЂўР В Р’В±Р В РЎвЂўР РЋРІР‚РЋР В РЎвЂўР В РЎвЂ“Р В РЎвЂў Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР РЋРЎвЂњ Р РЋРІР‚С™Р В Р’В° Р РЋР вЂљР В РЎвЂўР В Р’В»Р РЋР РЏР В РЎВР В РЎвЂ.",
    "members.invite": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋР С“Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°",
    "members.inviteTitle": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋР С“Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°",
    "members.inviteDesc": "Р В РІР‚в„ўР В Р вЂ Р В Р’ВµР В РўвЂР РЋРІР‚вЂњР РЋРІР‚С™Р РЋР Р‰ email Р В РўвЂР В Р’В»Р РЋР РЏ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ Р В РўвЂР В РЎвЂў Р РЋРІР‚В Р РЋР Р‰Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР РЋРЎвЂњ.",
    "members.sendInvite": "Р В РЎСљР В Р’В°Р В РўвЂР РЋРІР‚вЂњР РЋР С“Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ",
    "members.inviteFailed": "Р В РЎСљР В Р’Вµ Р В Р вЂ Р В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂўР РЋР С“Р РЋР РЏ Р В Р вЂ¦Р В Р’В°Р В РўвЂР РЋРІР‚вЂњР РЋР С“Р В Р’В»Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ",
    "members.inviteSent": "Р В РІР‚вЂќР В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІвЂљВ¬Р В Р’ВµР В Р вЂ¦Р В Р вЂ¦Р РЋР РЏ Р В Р вЂ¦Р В Р’В°Р В РўвЂР РЋРІР‚вЂњР РЋР С“Р В Р’В»Р В Р’В°Р В Р вЂ¦Р В РЎвЂў",
    "members.search": "Р В РЎСџР В РЎвЂўР РЋРІвЂљВ¬Р РЋРЎвЂњР В РЎвЂќ",
    "members.searchPlaceholder": "Р В РЎСџР В РЎвЂўР РЋРІвЂљВ¬Р РЋРЎвЂњР В РЎвЂќ Р В Р’В·Р В Р’В° email",
    "members.total": "Р В Р вЂ Р РЋР С“Р РЋР Р‰Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў",
    "members.email": "Email",
    "members.role": "Р В Р’В Р В РЎвЂўР В Р’В»Р РЋР Р‰",
    "members.actions": "Р В РІР‚СњР РЋРІР‚вЂњР РЋРІР‚вЂќ",
    "members.remove": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "members.confirmRemove": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋРІР‚В Р РЋР Р‰Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°?",
    "members.removeFailed": "Р В РЎСљР В Р’Вµ Р В Р вЂ Р В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂўР РЋР С“Р РЋР РЏ Р В Р вЂ Р В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ",
    "members.removed": "Р В РІР‚в„ўР В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў",
    "members.cannotRemoveLastOwner": "Р В РЎСљР В Р’ВµР В РЎВР В РЎвЂўР В Р’В¶Р В Р’В»Р В РЎвЂР В Р вЂ Р В РЎвЂў Р В Р вЂ Р В РЎвЂР В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р В РЎвЂўР РЋР С“Р РЋРІР‚С™Р В Р’В°Р В Р вЂ¦Р В Р вЂ¦Р РЋР Р‰Р В РЎвЂўР В РЎвЂ“Р В РЎвЂў Р В Р вЂ Р В Р’В»Р В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°",
    "members.manageDisabled": "Р В РІР‚С”Р В РЎвЂР РЋРІвЂљВ¬Р В Р’Вµ Р В Р’В°Р В РўвЂР В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р РЋРІР‚вЂњР РЋР С“Р РЋРІР‚С™Р РЋР вЂљР В Р’В°Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂ Р В Р’В°Р В Р’В±Р В РЎвЂў Р В Р вЂ Р В Р’В»Р В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В РЎвЂ Р В РЎВР В РЎвЂўР В Р’В¶Р РЋРЎвЂњР РЋРІР‚С™Р РЋР Р‰ Р В РЎвЂќР В Р’ВµР РЋР вЂљР РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р РЋРЎвЂњР РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В Р’В°Р В РЎВР В РЎвЂ",
    "members.inviteDisabled": "Р В РІР‚С”Р В РЎвЂР РЋРІвЂљВ¬Р В Р’Вµ Р В Р’В°Р В РўвЂР В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р РЋРІР‚вЂњР РЋР С“Р РЋРІР‚С™Р РЋР вЂљР В Р’В°Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂ Р В Р’В°Р В Р’В±Р В РЎвЂў Р В Р вЂ Р В Р’В»Р В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В РЎвЂ Р В РЎВР В РЎвЂўР В Р’В¶Р РЋРЎвЂњР РЋРІР‚С™Р РЋР Р‰ Р В Р’В·Р В Р’В°Р В РЎвЂ”Р РЋР вЂљР В РЎвЂўР РЋРІвЂљВ¬Р РЋРЎвЂњР В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ",
    "members.roleDisabled": "Р В РІР‚С”Р В РЎвЂР РЋРІвЂљВ¬Р В Р’Вµ Р В Р’В°Р В РўвЂР В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р РЋРІР‚вЂњР РЋР С“Р РЋРІР‚С™Р РЋР вЂљР В Р’В°Р РЋРІР‚С™Р В РЎвЂўР РЋР вЂљР В РЎвЂ Р В Р’В°Р В Р’В±Р В РЎвЂў Р В Р вЂ Р В Р’В»Р В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР В РЎвЂ Р В РЎВР В РЎвЂўР В Р’В¶Р РЋРЎвЂњР РЋРІР‚С™Р РЋР Р‰ Р В Р’В·Р В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р РЋР вЂ№Р В Р вЂ Р В Р’В°Р РЋРІР‚С™Р В РЎвЂ Р РЋР вЂљР В РЎвЂўР В Р’В»Р РЋРІР‚вЂњ",
    "members.roleUpdated": "Р В Р’В Р В РЎвЂўР В Р’В»Р РЋР Р‰ Р В РЎвЂўР В Р вЂ¦Р В РЎвЂўР В Р вЂ Р В Р’В»Р В Р’ВµР В Р вЂ¦Р В РЎвЂў",
    "members.roleFailed": "Р В РЎСљР В Р’Вµ Р В Р вЂ Р В РўвЂР В Р’В°Р В Р’В»Р В РЎвЂўР РЋР С“Р РЋР РЏ Р В Р’В·Р В РЎВР РЋРІР‚вЂњР В Р вЂ¦Р В РЎвЂР РЋРІР‚С™Р В РЎвЂ Р РЋР вЂљР В РЎвЂўР В Р’В»Р РЋР Р‰",
    "members.empty": "Р В Р в‚¬Р РЋРІР‚РЋР В Р’В°Р РЋР С“Р В Р вЂ¦Р В РЎвЂР В РЎвЂќР РЋРІР‚вЂњР В Р вЂ  Р В Р вЂ¦Р В Р’Вµ Р В Р’В·Р В Р вЂ¦Р В Р’В°Р В РІвЂћвЂ“Р В РўвЂР В Р’ВµР В Р вЂ¦Р В РЎвЂў.",
    "members.emailPlaceholder": "name@example.com",
  },
  pl: {"navbar.planner":"Planer","navbar.posts":"Posty","navbar.channels":"KanaР вЂўРІР‚С™y","navbar.calendar":"Kalendarz","navbar.integrations":"Integracje","navbar.members":"CzР вЂўРІР‚С™onkowie","navbar.signIn":"Zaloguj siР вЂќРІвЂћСћ","navbar.signOut":"Wyloguj siР вЂќРІвЂћСћ","planner.subtitle":"Planuj posty dla swoich kanaР вЂўРІР‚С™Р вЂњРЎвЂ“w.","button.newPost":"Nowy post","calendar.title":"Kalendarz","calendar.subtitle":"Planuj i przekР вЂўРІР‚С™adaj posty wedР вЂўРІР‚С™ug dni.","channels.title":"KanaР вЂўРІР‚С™y","channels.subtitle":"ZarzР вЂќРІР‚В¦dzaj dostР вЂќРІвЂћСћpnymi kanaР вЂўРІР‚С™ami publikacji.","channels.new":"Nowy kanaР вЂўРІР‚С™","channels.add":"Dodaj","channels.name":"Nazwa","channels.actions":"Akcje","channels.edit":"Edytuj","channels.cancel":"Anuluj","channels.delete":"UsuР вЂўРІР‚С›","channels.empty":"Brak kanaР вЂўРІР‚С™Р вЂњРЎвЂ“w.","select.placeholder":"WybierzР Р†Р вЂљР’В¦","action.save":"Zapisz","action.cancel":"Anuluj","action.edit":"Edytuj","action.quickEdit":"Szybka edycja","action.duplicate":"Duplikuj","action.delete":"UsuР вЂўРІР‚С›","action.undo":"Cofnij","action.publish":"Opublikuj","action.close":"Zamknij","posts.title":"Posty","posts.subtitle":"Lista zaplanowanych i opublikowanych postР вЂњРЎвЂ“w.","filters.channel":"KanaР вЂўРІР‚С™","filters.status":"Status","filters.allStatuses":"Wszystkie statusy","filters.title":"TytuР вЂўРІР‚С™","filters.searchPlaceholder":"Szukaj po tytuleР Р†Р вЂљР’В¦","table.date":"Data","table.channel":"KanaР вЂўРІР‚С™","table.title":"TytuР вЂўРІР‚С™","table.status":"Status","table.actions":"Akcje","table.noPosts":"Brak postР вЂњРЎвЂ“w.","table.noMatches":"Brak wynikР вЂњРЎвЂ“w dla filtrР вЂњРЎвЂ“w.","table.clearFilters":"WyczyР вЂўРІР‚С”Р вЂќРІР‚РЋ filtry","table.createPost":"UtwР вЂњРЎвЂ“rz post","table.newPost":"Nowy post","confirm.deletePost":"UsunР вЂќРІР‚В¦Р вЂќРІР‚РЋ ten post?","toast.saved":"Zapisano","toast.deleted":"UsuniР вЂќРІвЂћСћto","toast.duplicated":"Zduplikowano","toast.published":"Opublikowano","error.quotaPostsExceeded":"OsiР вЂќРІР‚В¦gniР вЂќРІвЂћСћto miesiР вЂќРІвЂћСћczny limit postР вЂњРЎвЂ“w.","pagination.prev":"Poprzednia","pagination.next":"NastР вЂќРІвЂћСћpna","importExport.exportJson":"Eksport JSON","importExport.importJson":"Import JSON","importExport.exportCsv":"Eksport CSV","importExport.importCsv":"Import CSV","importExport.invalidFile":"NieprawidР вЂўРІР‚С™owy format pliku","importExport.invalidCsv":"NieprawidР вЂўРІР‚С™owy CSV (sprawdР вЂўРЎвЂќ nagР вЂўРІР‚С™Р вЂњРЎвЂ“wki i wartoР вЂўРІР‚С”ci)","importExport.readError":"Nie udaР вЂўРІР‚С™o siР вЂќРІвЂћСћ odczytaР вЂќРІР‚РЋ pliku","confirm.deleteChannel":"UsunР вЂќРІР‚В¦Р вЂќРІР‚РЋ ten kanaР вЂўРІР‚С™?","newPost.titleNew":"Nowy post","newPost.titleEdit":"Edytuj post","newPost.subtitle":"UzupeР вЂўРІР‚С™nij dane poniР вЂўРЎВej.","newPost.channel":"KanaР вЂўРІР‚С™","newPost.status":"Status","newPost.datetime":"Data i godzina","newPost.titleLabel":"TytuР вЂўРІР‚С™","newPost.titlePlaceholder":"TytuР вЂўРІР‚С™ postaР Р†Р вЂљР’В¦","newPost.contentLabel":"TreР вЂўРІР‚С”Р вЂќРІР‚РЋ","newPost.contentPlaceholder":"Opcjonalna treР вЂўРІР‚С”Р вЂќРІР‚РЋР Р†Р вЂљР’В¦","newPost.mediaLabel":"Media-URL","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"Wymagane","day.tip":"WskazР вЂњРЎвЂ“wka: przeciР вЂќРІР‚В¦gnij post na godzinР вЂќРІвЂћСћ, aby zmieniР вЂќРІР‚РЋ plan.","day.noPosts":"Brak postР вЂњРЎвЂ“w w tym dniu.","day.quick":"Szybko","day.tz":"TZ","day.rescheduled":"Przeplanowano","preview.title":"PodglР вЂќРІР‚В¦d","preview.copy":"Kopiuj","preview.copied":"Skopiowano!","settings.title":"Ustawienia","settings.back":"Р Р†РІР‚В РЎвЂ™ PowrР вЂњРЎвЂ“t","settings.timezone":"Strefa czasowa","settings.note":"Uwaga: obecnie wpР вЂўРІР‚С™ywa tylko na szybkie presetty czasu; peР вЂўРІР‚С™ne wsparcie stref wkrР вЂњРЎвЂ“tce.","settings.quickTimes":"Szybkie godziny","settings.remove":"UsuР вЂўРІР‚С›","settings.addTime":"Dodaj godzinР вЂќРІвЂћСћ","settings.save":"Zapisz ustawienia","settings.useBrowserTz":"UР вЂўРЎВyj strefy przeglР вЂќРІР‚В¦darki","settings.plan":"Plan","settings.planHelp":"WpР вЂўРІР‚С™ywa na limity, np. posty/mies.","settings.planUpdated":"Plan zaktualizowany","settings.planUpdateFailed":"Nie udaР вЂўРІР‚С™o siР вЂќРІвЂћСћ zaktualizowaР вЂќРІР‚РЋ planu","members.title":"CzР вЂўРІР‚С™onkowie","members.subtitle":"ZarzР вЂќРІР‚В¦dzaj czР вЂўРІР‚С™onkami przestrzeni i rolami.","members.invite":"ZaproР вЂўРІР‚С” czР вЂўРІР‚С™onka","members.inviteTitle":"ZaproР вЂўРІР‚С” czР вЂўРІР‚С™onka","members.inviteDesc":"Wpisz email, aby zaprosiР вЂќРІР‚РЋ do tej przestrzeni.","members.sendInvite":"WyР вЂўРІР‚С”lij zaproszenie","members.inviteFailed":"Nie udaР вЂўРІР‚С™o siР вЂќРІвЂћСћ zaprosiР вЂќРІР‚РЋ","members.inviteSent":"Zaproszenie wysР вЂўРІР‚С™ane","members.search":"Szukaj","members.searchPlaceholder":"Szukaj po emailu","members.total":"razem","members.email":"Email","members.role":"Rola","members.actions":"Akcje","members.remove":"UsuР вЂўРІР‚С›","members.confirmRemove":"UsunР вЂќРІР‚В¦Р вЂќРІР‚РЋ tego czР вЂўРІР‚С™onka?","members.removeFailed":"Nie udaР вЂўРІР‚С™o siР вЂќРІвЂћСћ usunР вЂќРІР‚В¦Р вЂќРІР‚РЋ","members.removed":"UsuniР вЂќРІвЂћСћto","members.cannotRemoveLastOwner":"Nie moР вЂўРЎВna usunР вЂќРІР‚В¦Р вЂќРІР‚РЋ ostatniego wР вЂўРІР‚С™aР вЂўРІР‚С”ciciela","members.manageDisabled":"Tylko administratorzy lub wР вЂўРІР‚С™aР вЂўРІР‚С”ciciele mogР вЂќРІР‚В¦ zarzР вЂќРІР‚В¦dzaР вЂќРІР‚РЋ czР вЂўРІР‚С™onkami","members.inviteDisabled":"Tylko administratorzy lub wР вЂўРІР‚С™aР вЂўРІР‚С”ciciele mogР вЂќРІР‚В¦ zapraszaР вЂќРІР‚РЋ","members.roleDisabled":"Tylko administratorzy lub wР вЂўРІР‚С™aР вЂўРІР‚С”ciciele mogР вЂќРІР‚В¦ zmieniaР вЂќРІР‚РЋ role","members.roleUpdated":"Rola zaktualizowana","members.roleFailed":"Nie udaР вЂўРІР‚С™o siР вЂќРІвЂћСћ zmieniР вЂќРІР‚РЋ roli","members.empty":"Nie znaleziono czР вЂўРІР‚С™onkР вЂњРЎвЂ“w.","members.emailPlaceholder":"name@example.com" },
  de: {"navbar.planner":"Planer","navbar.posts":"BeitrР вЂњР’В¤ge","navbar.channels":"KanР вЂњР’В¤le","navbar.calendar":"Kalender","navbar.integrations":"Integrationen","navbar.members":"Mitglieder","navbar.signIn":"Anmelden","navbar.signOut":"Abmelden","planner.subtitle":"Plane BeitrР вЂњР’В¤ge fР вЂњРЎВr deine KanР вЂњР’В¤le.","button.newPost":"Neuer Beitrag","calendar.title":"Kalender","calendar.subtitle":"Plane und verschiebe BeitrР вЂњР’В¤ge nach Tagen.","channels.title":"KanР вЂњР’В¤le","channels.subtitle":"Verwalte verfР вЂњРЎВgbare VerР вЂњР’В¶ffentlichungs-KanР вЂњР’В¤le.","channels.new":"Neuer Kanal","channels.add":"HinzufР вЂњРЎВgen","channels.name":"Name","channels.actions":"Aktionen","channels.edit":"Bearbeiten","channels.cancel":"Abbrechen","channels.delete":"LР вЂњР’В¶schen","channels.empty":"Noch keine KanР вЂњР’В¤le.","select.placeholder":"AuswР вЂњР’В¤hlenР Р†Р вЂљР’В¦","action.save":"Speichern","action.cancel":"Abbrechen","action.edit":"Bearbeiten","action.quickEdit":"Schnell bearbeiten","action.duplicate":"Duplizieren","action.delete":"LР вЂњР’В¶schen","action.undo":"RР вЂњРЎВckgР вЂњР’В¤ngig","action.publish":"VerР вЂњР’В¶ffentlichen","action.close":"SchlieР вЂњРЎСџen","posts.title":"BeitrР вЂњР’В¤ge","posts.subtitle":"Liste geplanter und verР вЂњР’В¶ffentlichter BeitrР вЂњР’В¤ge.","filters.channel":"Kanal","filters.status":"Status","filters.allStatuses":"Alle Status","filters.title":"Titel","filters.searchPlaceholder":"Nach Titel suchenР Р†Р вЂљР’В¦","table.date":"Datum","table.channel":"Kanal","table.title":"Titel","table.status":"Status","table.actions":"Aktionen","table.noPosts":"Noch keine BeitrР вЂњР’В¤ge.","table.noMatches":"Keine BeitrР вЂњР’В¤ge entsprechen den Filtern.","table.clearFilters":"Filter zurР вЂњРЎВcksetzen","table.createPost":"Beitrag erstellen","table.newPost":"Neuer Beitrag","confirm.deletePost":"Diesen Beitrag lР вЂњР’В¶schen?","toast.saved":"Gespeichert","toast.deleted":"GelР вЂњР’В¶scht","toast.duplicated":"Dupliziert","toast.published":"VerР вЂњР’В¶ffentlicht","error.quotaPostsExceeded":"Monatliches Beitragslimit erreicht.","pagination.prev":"ZurР вЂњРЎВck","pagination.next":"Weiter","importExport.exportJson":"JSON exportieren","importExport.importJson":"JSON importieren","importExport.exportCsv":"CSV exportieren","importExport.importCsv":"CSV importieren","importExport.invalidFile":"UngР вЂњРЎВltiges Dateiformat","importExport.invalidCsv":"UngР вЂњРЎВltige CSV (Kopfzeilen/Werte prР вЂњРЎВfen)","importExport.readError":"Datei konnte nicht gelesen werden","confirm.deleteChannel":"Diesen Kanal lР вЂњР’В¶schen?","newPost.titleNew":"Neuer Beitrag","newPost.titleEdit":"Beitrag bearbeiten","newPost.subtitle":"FР вЂњРЎВlle die Details unten aus.","newPost.channel":"Kanal","newPost.status":"Status","newPost.datetime":"Datum & Uhrzeit","newPost.titleLabel":"Titel","newPost.titlePlaceholder":"BeitragstitelР Р†Р вЂљР’В¦","newPost.contentLabel":"Inhalt","newPost.contentPlaceholder":"Optionaler InhaltР Р†Р вЂљР’В¦","newPost.mediaLabel":"Media-URLs","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"Pflichtfeld","day.tip":"Tipp: Beitrag auf eine Uhrzeit ziehen, um neu zu planen.","day.noPosts":"Keine BeitrР вЂњР’В¤ge an diesem Tag.","day.quick":"Schnell","day.tz":"TZ","day.rescheduled":"Neu geplant","preview.title":"Vorschau","preview.copy":"Kopieren","preview.copied":"Kopiert!","settings.title":"Einstellungen","settings.back":"Р Р†РІР‚В РЎвЂ™ ZurР вЂњРЎВck","settings.timezone":"Zeitzone","settings.note":"Hinweis: Derzeit betrifft dies nur Schnellzeiten; volle TZ-UnterstР вЂњРЎВtzung folgt.","settings.quickTimes":"Schnellzeiten","settings.remove":"Entfernen","settings.addTime":"Zeit hinzufР вЂњРЎВgen","settings.save":"Einstellungen speichern","settings.useBrowserTz":"Browser-Zeitzone verwenden","settings.plan":"Plan","settings.planHelp":"Beeinflusst Limits wie BeitrР вЂњР’В¤ge/Monat.","settings.planUpdated":"Plan aktualisiert","settings.planUpdateFailed":"Planaktualisierung fehlgeschlagen","members.title":"Mitglieder","members.subtitle":"Mitglieder und Rollen des Arbeitsbereichs verwalten.","members.invite":"Mitglied einladen","members.inviteTitle":"Mitglied einladen","members.inviteDesc":"E-Mail eingeben, um in diesen Arbeitsbereich einzuladen.","members.sendInvite":"Einladung senden","members.inviteFailed":"Einladung fehlgeschlagen","members.inviteSent":"Einladung gesendet","members.search":"Suche","members.searchPlaceholder":"Suche per E-Mail","members.total":"gesamt","members.email":"E-Mail","members.role":"Rolle","members.actions":"Aktionen","members.remove":"Entfernen","members.confirmRemove":"Dieses Mitglied entfernen?","members.removeFailed":"Entfernen fehlgeschlagen","members.removed":"Entfernt","members.cannotRemoveLastOwner":"Letzten Besitzer kann man nicht entfernen","members.manageDisabled":"Nur Admins oder Besitzer kР вЂњР’В¶nnen Mitglieder verwalten","members.inviteDisabled":"Nur Admins oder Besitzer kР вЂњР’В¶nnen einladen","members.roleDisabled":"Nur Admins oder Besitzer kР вЂњР’В¶nnen Rollen Р вЂњР’В¤ndern","members.roleUpdated":"Rolle aktualisiert","members.roleFailed":"RollenР вЂњР’В¤nderung fehlgeschlagen","members.empty":"Keine Mitglieder gefunden.","members.emailPlaceholder":"name@example.com","status.Draft":"Entwurf","status.Scheduled":"Geplant","status.Published":"VerГ¶ffentlicht","rbac.cannotUpdate":"Keine Berechtigung zum Aktualisieren.","rbac.cannotPublish":"Keine Berechtigung zum VerГ¶ffentlichen.","rbac.cannotDelete":"Keine Berechtigung zum LГ¶schen.","rbac.cannotCreate":"Keine Berechtigung zum Erstellen." },
  es: {"navbar.planner":"Planificador","navbar.posts":"Publicaciones","navbar.channels":"Canales","navbar.calendar":"Calendario","navbar.integrations":"Integraciones","navbar.members":"Miembros","navbar.signIn":"Iniciar sesiР вЂњРЎвЂ“n","navbar.signOut":"Cerrar sesiР вЂњРЎвЂ“n","planner.subtitle":"Planifica publicaciones para tus canales.","button.newPost":"Nueva publicaciР вЂњРЎвЂ“n","calendar.title":"Calendario","calendar.subtitle":"Planifica y reprograma por dР вЂњР’В­a.","channels.title":"Canales","channels.subtitle":"Administra los canales disponibles.","channels.new":"Nuevo canal","channels.add":"Agregar","channels.name":"Nombre","channels.actions":"Acciones","channels.edit":"Editar","channels.cancel":"Cancelar","channels.delete":"Eliminar","channels.empty":"AР вЂњРЎвЂќn no hay canales.","select.placeholder":"SeleccionarР Р†Р вЂљР’В¦","action.save":"Guardar","action.cancel":"Cancelar","action.edit":"Editar","action.quickEdit":"EdiciР вЂњРЎвЂ“n rР вЂњР Р‹pida","action.duplicate":"Duplicar","action.delete":"Eliminar","action.undo":"Deshacer","action.publish":"Publicar","action.close":"Cerrar","posts.title":"Publicaciones","posts.subtitle":"Lista de publicaciones programadas y publicadas.","filters.channel":"Canal","filters.status":"Estado","filters.allStatuses":"Todos los estados","filters.title":"TР вЂњР’В­tulo","filters.searchPlaceholder":"Buscar por tР вЂњР’В­tuloР Р†Р вЂљР’В¦","table.date":"Fecha","table.channel":"Canal","table.title":"TР вЂњР’В­tulo","table.status":"Estado","table.actions":"Acciones","table.noPosts":"AР вЂњРЎвЂќn no hay publicaciones.","table.noMatches":"Ninguna publicaciР вЂњРЎвЂ“n coincide con los filtros.","table.clearFilters":"Limpiar filtros","table.createPost":"Crear publicaciР вЂњРЎвЂ“n","table.newPost":"Nueva publicaciР вЂњРЎвЂ“n","confirm.deletePost":"Р вЂ™РЎвЂ”Eliminar esta publicaciР вЂњРЎвЂ“n?","toast.saved":"Guardado","toast.deleted":"Eliminado","toast.duplicated":"Duplicado","toast.published":"Publicado","error.quotaPostsExceeded":"Se alcanzР вЂњРЎвЂ“ el lР вЂњР’В­mite mensual de publicaciones.","pagination.prev":"Anterior","pagination.next":"Siguiente","importExport.exportJson":"Exportar JSON","importExport.importJson":"Importar JSON","importExport.exportCsv":"Exportar CSV","importExport.importCsv":"Importar CSV","importExport.invalidFile":"Formato de archivo no vР вЂњР Р‹lido","importExport.invalidCsv":"CSV no vР вЂњР Р‹lido (verifica encabezados y valores)","importExport.readError":"No se pudo leer el archivo","confirm.deleteChannel":"Р вЂ™РЎвЂ”Eliminar este canal?","newPost.titleNew":"Nueva publicaciР вЂњРЎвЂ“n","newPost.titleEdit":"Editar publicaciР вЂњРЎвЂ“n","newPost.subtitle":"Completa los datos abajo.","newPost.channel":"Canal","newPost.status":"Estado","newPost.datetime":"Fecha y hora","newPost.titleLabel":"TР вЂњР’В­tulo","newPost.titlePlaceholder":"TР вЂњР’В­tulo de la publicaciР вЂњРЎвЂ“nР Р†Р вЂљР’В¦","newPost.contentLabel":"Contenido","newPost.contentPlaceholder":"Contenido opcionalР Р†Р вЂљР’В¦","newPost.mediaLabel":"URLs de medios","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"Obligatorio","day.tip":"Consejo: arrastra una publicaciР вЂњРЎвЂ“n a una hora para reprogramar.","day.noPosts":"No hay publicaciones este dР вЂњР’В­a.","day.quick":"RР вЂњР Р‹pido","day.tz":"TZ","day.rescheduled":"Reprogramado","preview.title":"Vista previa","preview.copy":"Copiar","preview.copied":"Р вЂ™Р Р‹Copiado!","settings.title":"ConfiguraciР вЂњРЎвЂ“n","settings.back":"Р Р†РІР‚В РЎвЂ™ Volver","settings.timezone":"Zona horaria","settings.note":"Nota: por ahora afecta solo los horarios rР вЂњР Р‹pidos; soporte completo prР вЂњРЎвЂ“ximamente.","settings.quickTimes":"Horarios rР вЂњР Р‹pidos","settings.remove":"Eliminar","settings.addTime":"Agregar hora","settings.save":"Guardar configuraciР вЂњРЎвЂ“n","settings.useBrowserTz":"Usar zona del navegador","settings.plan":"Plan","settings.planHelp":"Afecta lР вЂњР’В­mites como publicaciones/mes.","settings.planUpdated":"Plan actualizado","settings.planUpdateFailed":"Error al actualizar el plan","members.title":"Miembros","members.subtitle":"Gestiona miembros y roles del espacio.","members.invite":"Invitar miembro","members.inviteTitle":"Invitar miembro","members.inviteDesc":"Ingresa un email para invitar a este espacio.","members.sendInvite":"Enviar invitaciР вЂњРЎвЂ“n","members.inviteFailed":"Error al invitar","members.inviteSent":"InvitaciР вЂњРЎвЂ“n enviada","members.search":"Buscar","members.searchPlaceholder":"Buscar por email","members.total":"total","members.email":"Email","members.role":"Rol","members.actions":"Acciones","members.remove":"Eliminar","members.confirmRemove":"Р вЂ™РЎвЂ”Eliminar este miembro?","members.removeFailed":"Error al eliminar","members.removed":"Eliminado","members.cannotRemoveLastOwner":"No se puede eliminar al Р вЂњРЎвЂќltimo propietario","members.manageDisabled":"Solo administradores o propietarios pueden gestionar miembros","members.inviteDisabled":"Solo administradores o propietarios pueden invitar","members.roleDisabled":"Solo administradores o propietarios pueden cambiar roles","members.roleUpdated":"Rol actualizado","members.roleFailed":"Error al cambiar el rol","members.empty":"No se encontraron miembros.","members.emailPlaceholder":"name@example.com","status.Draft":"Borrador","status.Scheduled":"Programado","status.Published":"Publicado","rbac.cannotUpdate":"No tienes permiso para actualizar.","rbac.cannotPublish":"No tienes permiso para publicar.","rbac.cannotDelete":"No tienes permiso para eliminar.","rbac.cannotCreate":"No tienes permiso para crear." },
  fr: {"navbar.planner":"Planificateur","navbar.posts":"Publications","navbar.channels":"Canaux","navbar.calendar":"Calendrier","navbar.integrations":"IntР вЂњР’В©grations","navbar.members":"Membres","navbar.signIn":"Se connecter","navbar.signOut":"Se dР вЂњР’В©connecter","planner.subtitle":"Planifiez des publications pour vos canaux.","button.newPost":"Nouvelle publication","calendar.title":"Calendrier","calendar.subtitle":"Planifiez et reprogrammez par jour.","channels.title":"Canaux","channels.subtitle":"GР вЂњР’В©rez les canaux de publication disponibles.","channels.new":"Nouveau canal","channels.add":"Ajouter","channels.name":"Nom","channels.actions":"Actions","channels.edit":"Modifier","channels.cancel":"Annuler","channels.delete":"Supprimer","channels.empty":"Pas encore de canaux.","select.placeholder":"SР вЂњР’В©lectionnerР Р†Р вЂљР’В¦","action.save":"Enregistrer","action.cancel":"Annuler","action.edit":"Modifier","action.quickEdit":"Modification rapide","action.duplicate":"Dupliquer","action.delete":"Supprimer","action.undo":"Annuler","action.publish":"Publier","action.close":"Fermer","posts.title":"Publications","posts.subtitle":"Liste des publications planifiР вЂњР’В©es et publiР вЂњР’В©es.","filters.channel":"Canal","filters.status":"Statut","filters.allStatuses":"Tous les statuts","filters.title":"Titre","filters.searchPlaceholder":"Rechercher par titreР Р†Р вЂљР’В¦","table.date":"Date","table.channel":"Canal","table.title":"Titre","table.status":"Statut","table.actions":"Actions","table.noPosts":"Aucune publication pour lР Р†Р вЂљРІвЂћСћinstant.","table.noMatches":"Aucune publication ne correspond aux filtres.","table.clearFilters":"Effacer les filtres","table.createPost":"CrР вЂњР’В©er une publication","table.newPost":"Nouvelle publication","confirm.deletePost":"Supprimer cette publication ?","toast.saved":"EnregistrР вЂњР’В©","toast.deleted":"SupprimР вЂњР’В©","toast.duplicated":"DupliquР вЂњР’В©","toast.published":"PubliР вЂњР’В©","error.quotaPostsExceeded":"Limite mensuelle atteinte.","pagination.prev":"PrР вЂњР’В©cР вЂњР’В©dent","pagination.next":"Suivant","importExport.exportJson":"Exporter JSON","importExport.importJson":"Importer JSON","importExport.exportCsv":"Exporter CSV","importExport.importCsv":"Importer CSV","importExport.invalidFile":"Format de fichier invalide","importExport.invalidCsv":"CSV invalide (vР вЂњР’В©rifiez en-tР вЂњР вЂћtes et valeurs)","importExport.readError":"Impossible de lire le fichier","confirm.deleteChannel":"Supprimer ce canal ?","newPost.titleNew":"Nouvelle publication","newPost.titleEdit":"Modifier la publication","newPost.subtitle":"Renseignez les informations ci-dessous.","newPost.channel":"Canal","newPost.status":"Statut","newPost.datetime":"Date et heure","newPost.titleLabel":"Titre","newPost.titlePlaceholder":"Titre de la publicationР Р†Р вЂљР’В¦","newPost.contentLabel":"Contenu","newPost.contentPlaceholder":"Contenu optionnelР Р†Р вЂљР’В¦","newPost.mediaLabel":"URLs mР вЂњР’В©dia","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"Obligatoire","day.tip":"Astuce : faites glisser une publication pour la reprogrammer.","day.noPosts":"Aucune publication ce jour-lР вЂњР’В .","day.quick":"Rapide","day.tz":"TZ","day.rescheduled":"ReprogrammР вЂњР’В©","preview.title":"AperР вЂњР’В§u","preview.copy":"Copier","preview.copied":"CopiР вЂњР’В© !","settings.title":"ParamР вЂњР Рѓtres","settings.back":"Р Р†РІР‚В РЎвЂ™ Retour","settings.timezone":"Fuseau horaire","settings.note":"Remarque : affecte pour lР Р†Р вЂљРІвЂћСћinstant les horaires rapides seulement ; prise en charge complР вЂњР Рѓte Р вЂњР’В  venir.","settings.quickTimes":"Horaires rapides","settings.remove":"Supprimer","settings.addTime":"Ajouter une heure","settings.save":"Enregistrer les paramР вЂњР Рѓtres","settings.useBrowserTz":"Utiliser le fuseau du navigateur","settings.plan":"Offre","settings.planHelp":"Impacte les limites comme publications/mois.","settings.planUpdated":"Offre mise Р вЂњР’В  jour","settings.planUpdateFailed":"Р вЂњРІР‚В°chec de la mise Р вЂњР’В  jour","members.title":"Membres","members.subtitle":"GР вЂњР’В©rer les membres et rР вЂњРўвЂles de lР Р†Р вЂљРІвЂћСћespace.","members.invite":"Inviter un membre","members.inviteTitle":"Inviter un membre","members.inviteDesc":"Saisissez un e-mail pour inviter Р вЂњР’В  cet espace.","members.sendInvite":"Envoyer lР Р†Р вЂљРІвЂћСћinvitation","members.inviteFailed":"Р вЂњРІР‚В°chec de lР Р†Р вЂљРІвЂћСћinvitation","members.inviteSent":"Invitation envoyР вЂњР’В©e","members.search":"Recherche","members.searchPlaceholder":"Recherche par e-mail","members.total":"total","members.email":"EР Р†Р вЂљРІР‚Вmail","members.role":"RР вЂњРўвЂle","members.actions":"Actions","members.remove":"Supprimer","members.confirmRemove":"Supprimer ce membre ?","members.removeFailed":"Р вЂњРІР‚В°chec de la suppression","members.removed":"SupprimР вЂњР’В©","members.cannotRemoveLastOwner":"Impossible de supprimer le dernier propriР вЂњР’В©taire","members.manageDisabled":"Seuls les admins ou propriР вЂњР’В©taires peuvent gР вЂњР’В©rer les membres","members.inviteDisabled":"Seuls les admins ou propriР вЂњР’В©taires peuvent inviter","members.roleDisabled":"Seuls les admins ou propriР вЂњР’В©taires peuvent changer les rР вЂњРўвЂles","members.roleUpdated":"RР вЂњРўвЂle mis Р вЂњР’В  jour","members.roleFailed":"Р вЂњРІР‚В°chec du changement de rР вЂњРўвЂle","members.empty":"Aucun membre trouvР вЂњР’В©.","members.emailPlaceholder":"name@example.com" },
  it: {"navbar.planner":"Pianificatore","navbar.posts":"Post","navbar.channels":"Canali","navbar.calendar":"Calendario","navbar.integrations":"Integrazioni","navbar.members":"Membri","navbar.signIn":"Accedi","navbar.signOut":"Esci","planner.subtitle":"Pianifica i post per i tuoi canali.","button.newPost":"Nuovo post","calendar.title":"Calendario","calendar.subtitle":"Pianifica e riprogramma per giorno.","channels.title":"Canali","channels.subtitle":"Gestisci i canali di pubblicazione disponibili.","channels.new":"Nuovo canale","channels.add":"Aggiungi","channels.name":"Nome","channels.actions":"Azioni","channels.edit":"Modifica","channels.cancel":"Annulla","channels.delete":"Elimina","channels.empty":"Nessun canale.","select.placeholder":"SelezionaР Р†Р вЂљР’В¦","action.save":"Salva","action.cancel":"Annulla","action.edit":"Modifica","action.quickEdit":"Modifica rapida","action.duplicate":"Duplica","action.delete":"Elimina","action.undo":"Annulla","action.publish":"Pubblica","action.close":"Chiudi","posts.title":"Post","posts.subtitle":"Elenco dei post programmati e pubblicati.","filters.channel":"Canale","filters.status":"Stato","filters.allStatuses":"Tutti gli stati","filters.title":"Titolo","filters.searchPlaceholder":"Cerca per titoloР Р†Р вЂљР’В¦","table.date":"Data","table.channel":"Canale","table.title":"Titolo","table.status":"Stato","table.actions":"Azioni","table.noPosts":"Nessun post.","table.noMatches":"Nessun post corrisponde ai filtri.","table.clearFilters":"Pulisci filtri","table.createPost":"Crea post","table.newPost":"Nuovo post","confirm.deletePost":"Eliminare questo post?","toast.saved":"Salvato","toast.deleted":"Eliminato","toast.duplicated":"Duplicato","toast.published":"Pubblicato","error.quotaPostsExceeded":"Limite mensile di post raggiunto.","pagination.prev":"Precedente","pagination.next":"Successivo","importExport.exportJson":"Esporta JSON","importExport.importJson":"Importa JSON","importExport.exportCsv":"Esporta CSV","importExport.importCsv":"Importa CSV","importExport.invalidFile":"Formato file non valido","importExport.invalidCsv":"CSV non valida (controlla intestazioni e valori)","importExport.readError":"Impossibile leggere il file","confirm.deleteChannel":"Eliminare questo canale?","newPost.titleNew":"Nuovo post","newPost.titleEdit":"Modifica post","newPost.subtitle":"Compila i dettagli qui sotto.","newPost.channel":"Canale","newPost.status":"Stato","newPost.datetime":"Data e ora","newPost.titleLabel":"Titolo","newPost.titlePlaceholder":"Titolo del postР Р†Р вЂљР’В¦","newPost.contentLabel":"Contenuto","newPost.contentPlaceholder":"Contenuto opzionaleР Р†Р вЂљР’В¦","newPost.mediaLabel":"URL media","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"Obbligatorio","day.tip":"Suggerimento: trascina un post su un orario per riprogrammarlo.","day.noPosts":"Nessun post in questo giorno.","day.quick":"Rapido","day.tz":"TZ","day.rescheduled":"Ripianificato","preview.title":"Anteprima","preview.copy":"Copia","preview.copied":"Copiato!","settings.title":"Impostazioni","settings.back":"Р Р†РІР‚В РЎвЂ™ Indietro","settings.timezone":"Fuso orario","settings.note":"Nota: al momento influisce solo sui tempi rapidi; pieno supporto in arrivo.","settings.quickTimes":"Orari rapidi","settings.remove":"Rimuovi","settings.addTime":"Aggiungi ora","settings.save":"Salva impostazioni","settings.useBrowserTz":"Usa fuso del browser","settings.plan":"Piano","settings.planHelp":"Influisce su limiti come post/mese.","settings.planUpdated":"Piano aggiornato","settings.planUpdateFailed":"Aggiornamento piano non riuscito","members.title":"Membri","members.subtitle":"Gestisci i membri e i ruoli dello spazio.","members.invite":"Invita membro","members.inviteTitle":"Invita membro","members.inviteDesc":"Inserisci un'email per invitare in questo spazio.","members.sendInvite":"Invia invito","members.inviteFailed":"Invito non riuscito","members.inviteSent":"Invito inviato","members.search":"Cerca","members.searchPlaceholder":"Cerca per email","members.total":"totale","members.email":"Email","members.role":"Ruolo","members.actions":"Azioni","members.remove":"Rimuovi","members.confirmRemove":"Rimuovere questo membro?","members.removeFailed":"Rimozione non riuscita","members.removed":"Rimosso","members.cannotRemoveLastOwner":"Impossibile rimuovere lР Р†Р вЂљРІвЂћСћultimo proprietario","members.manageDisabled":"Solo amministratori o proprietari possono gestire i membri","members.inviteDisabled":"Solo amministratori o proprietari possono invitare","members.roleDisabled":"Solo amministratori o proprietari possono cambiare i ruoli","members.roleUpdated":"Ruolo aggiornato","members.roleFailed":"Cambio ruolo non riuscito","members.empty":"Nessun membro trovato.","members.emailPlaceholder":"name@example.com" },
  pt: {"navbar.planner":"Planejador","navbar.posts":"Postagens","navbar.channels":"Canais","navbar.calendar":"CalendР вЂњР Р‹rio","navbar.integrations":"IntegraР вЂњР’В§Р вЂњР’Вµes","navbar.members":"Membros","navbar.signIn":"Entrar","navbar.signOut":"Sair","planner.subtitle":"Planeje postagens para seus canais.","button.newPost":"Nova postagem","calendar.title":"CalendР вЂњР Р‹rio","calendar.subtitle":"Planeje e reprograme por dia.","channels.title":"Canais","channels.subtitle":"Gerencie canais de publicaР вЂњР’В§Р вЂњР в‚¬o disponР вЂњР’В­veis.","channels.new":"Novo canal","channels.add":"Adicionar","channels.name":"Nome","channels.actions":"AР вЂњР’В§Р вЂњР’Вµes","channels.edit":"Editar","channels.cancel":"Cancelar","channels.delete":"Excluir","channels.empty":"Ainda nР вЂњР в‚¬o hР вЂњР Р‹ canais.","select.placeholder":"SelecionarР Р†Р вЂљР’В¦","action.save":"Salvar","action.cancel":"Cancelar","action.edit":"Editar","action.quickEdit":"EdiР вЂњР’В§Р вЂњР в‚¬o rР вЂњР Р‹pida","action.duplicate":"Duplicar","action.delete":"Excluir","action.undo":"Desfazer","action.publish":"Publicar","action.close":"Fechar","posts.title":"Postagens","posts.subtitle":"Lista de postagens programadas e publicadas.","filters.channel":"Canal","filters.status":"Status","filters.allStatuses":"Todos os status","filters.title":"TР вЂњР’В­tulo","filters.searchPlaceholder":"Pesquisar por tР вЂњР’В­tuloР Р†Р вЂљР’В¦","table.date":"Data","table.channel":"Canal","table.title":"TР вЂњР’В­tulo","table.status":"Status","table.actions":"AР вЂњР’В§Р вЂњР’Вµes","table.noPosts":"Ainda nР вЂњР в‚¬o hР вЂњР Р‹ postagens.","table.noMatches":"Nenhuma postagem corresponde aos filtros.","table.clearFilters":"Limpar filtros","table.createPost":"Criar postagem","table.newPost":"Nova postagem","confirm.deletePost":"Excluir esta postagem?","toast.saved":"Salvo","toast.deleted":"ExcluР вЂњР’В­do","toast.duplicated":"Duplicado","toast.published":"Publicado","error.quotaPostsExceeded":"Limite mensal de postagens atingido.","pagination.prev":"Anterior","pagination.next":"PrР вЂњРЎвЂ“ximo","importExport.exportJson":"Exportar JSON","importExport.importJson":"Importar JSON","importExport.exportCsv":"Exportar CSV","importExport.importCsv":"Importar CSV","importExport.invalidFile":"Formato de arquivo invР вЂњР Р‹lido","importExport.invalidCsv":"CSV invР вЂњР Р‹lido (verifique cabeР вЂњР’В§alhos e valores)","importExport.readError":"NР вЂњР в‚¬o foi possР вЂњР’В­vel ler o arquivo","confirm.deleteChannel":"Excluir este canal?","newPost.titleNew":"Nova postagem","newPost.titleEdit":"Editar postagem","newPost.subtitle":"Preencha os dados abaixo.","newPost.channel":"Canal","newPost.status":"Status","newPost.datetime":"Data e hora","newPost.titleLabel":"TР вЂњР’В­tulo","newPost.titlePlaceholder":"TР вЂњР’В­tulo da postagemР Р†Р вЂљР’В¦","newPost.contentLabel":"ConteР вЂњРЎвЂќdo","newPost.contentPlaceholder":"ConteР вЂњРЎвЂќdo opcionalР Р†Р вЂљР’В¦","newPost.mediaLabel":"URLs de mР вЂњР’В­dia","newPost.mediaPlaceholder":"https://Р Р†Р вЂљР’В¦","error.required":"ObrigatР вЂњРЎвЂ“rio","day.tip":"Dica: arraste uma postagem para um horР вЂњР Р‹rio para reprogramar.","day.noPosts":"Sem postagens neste dia.","day.quick":"RР вЂњР Р‹pido","day.tz":"TZ","day.rescheduled":"Reprogramado","preview.title":"PrР вЂњР’В©-visualizaР вЂњР’В§Р вЂњР в‚¬o","preview.copy":"Copiar","preview.copied":"Copiado!","settings.title":"ConfiguraР вЂњР’В§Р вЂњР’Вµes","settings.back":"Р Р†РІР‚В РЎвЂ™ Voltar","settings.timezone":"Fuso horР вЂњР Р‹rio","settings.note":"ObservaР вЂњР’В§Р вЂњР в‚¬o: por enquanto afeta apenas horР вЂњР Р‹rios rР вЂњР Р‹pidos; suporte completo em breve.","settings.quickTimes":"HorР вЂњР Р‹rios rР вЂњР Р‹pidos","settings.remove":"Remover","settings.addTime":"Adicionar horР вЂњР Р‹rio","settings.save":"Salvar configuraР вЂњР’В§Р вЂњР’Вµes","settings.useBrowserTz":"Usar fuso do navegador","settings.plan":"Plano","settings.planHelp":"Afeta limites como postagens/mР вЂњР вЂћs.","settings.planUpdated":"Plano atualizado","settings.planUpdateFailed":"Falha ao atualizar o plano","members.title":"Membros","members.subtitle":"Gerencie os membros e funР вЂњР’В§Р вЂњР’Вµes do espaР вЂњР’В§o.","members.invite":"Convidar membro","members.inviteTitle":"Convidar membro","members.inviteDesc":"Informe um e-mail para convidar para este espaР вЂњР’В§o.","members.sendInvite":"Enviar convite","members.inviteFailed":"Falha ao convidar","members.inviteSent":"Convite enviado","members.search":"Buscar","members.searchPlaceholder":"Buscar por e-mail","members.total":"total","members.email":"E-mail","members.role":"FunР вЂњР’В§Р вЂњР в‚¬o","members.actions":"AР вЂњР’В§Р вЂњР’Вµes","members.remove":"Remover","members.confirmRemove":"Remover este membro?","members.removeFailed":"Falha ao remover","members.removed":"Removido","members.cannotRemoveLastOwner":"NР вЂњР в‚¬o Р вЂњР’В© possР вЂњР’В­vel remover o Р вЂњРЎвЂќltimo proprietР вЂњР Р‹rio","members.manageDisabled":"Apenas administradores ou proprietР вЂњР Р‹rios podem gerenciar membros","members.inviteDisabled":"Apenas administradores ou proprietР вЂњР Р‹rios podem convidar","members.roleDisabled":"Apenas administradores ou proprietР вЂњР Р‹rios podem alterar funР вЂњР’В§Р вЂњР’Вµes","members.roleUpdated":"FunР вЂњР’В§Р вЂњР в‚¬o atualizada","members.roleFailed":"Falha ao alterar funР вЂњР’В§Р вЂњР в‚¬o","members.empty":"Nenhum membro encontrado.","members.emailPlaceholder":"name@example.com" },
};

let currentLocale: Locale = "uk";
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized) return;
  initialized = true;
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    const allowed: ReadonlyArray<Locale> = ["en", "uk", "pl", "de", "es", "fr", "it", "pt"];
    if (saved && (allowed as ReadonlyArray<string>).includes(saved)) { currentLocale = saved as Locale; } else if (typeof navigator !== 'undefined' && navigator.language) { const lang = navigator.language.toLowerCase(); const map: Record<string, Locale> = { 'uk': 'uk','uk-ua':'uk','en':'en','en-us':'en','en-gb':'en','pl':'pl','de':'de','es':'es','fr':'fr','it':'it','pt':'pt','pt-br':'pt','pt-pt':'pt' }; for (const key of Object.keys(map)) { if (lang === key || lang.startsWith(key + '-')) { currentLocale = map[key]; break; } } }
  }
}

export function getLocale(): Locale {
  ensureInit();
  return currentLocale;
}

export function setLocale(next: Locale) {
  ensureInit();
  currentLocale = next;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem("locale", next); } catch {}
    try {
      void fetch("/api/locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: next }),
      });
    } catch {}
  }
  for (const fn of listeners) {
    try { fn(); } catch {}
  }
}

export function subscribeLocale(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key: string): string {
  const dict = MESSAGES[currentLocale] ?? MESSAGES.en;
  return dict[key] ?? MESSAGES.en[key] ?? key;
}

