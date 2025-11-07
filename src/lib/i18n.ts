export type Locale = "en" | "uk";

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
    "select.placeholder": "Select…",
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
    "filters.searchPlaceholder": "Search title…",
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
    "newPost.titlePlaceholder": "Post title…",
    "newPost.contentLabel": "Content",
    "newPost.contentPlaceholder": "Optional content…",
    "error.required": "Required",

    // Day modal
    "day.tip": "Tip: drag a post onto a time to reschedule.",
    "day.noPosts": "No posts for this day.",
    "day.quick": "Quick",
    "day.tz": "TZ",
    "day.rescheduled": "Rescheduled",

    // Preview
    "preview.title": "Preview",

    // Settings
    "settings.title": "Settings",
    "settings.back": "← Back",
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
  uk: {},
};

let currentLocale: Locale = "en";
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized) return;
  initialized = true;
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "uk") currentLocale = saved;
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
    try {
      window.localStorage.setItem("locale", next);
    } catch {}
  }
  for (const fn of listeners) {
    try {
      fn();
    } catch {}
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

