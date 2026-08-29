import React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { 
  HeartPulse, 
  Shield, 
  LogOut, 
  RefreshCw, 
  Activity, 
  Users, 
  UserPlus, 
  MessageSquare, 
  Radio, 
  User 
} from "lucide-react"

export default function ShadcnAdminLayout({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  onRefresh, 
  children,
  isAdmin = true 
}) {
  const roleTitle = user?.role?.toUpperCase() || (isAdmin ? "ADMIN" : "USER")

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Official Shadcn Admin Sidebar */}
      <aside className={`w-68 flex flex-col border-r bg-slate-950 p-6 ${isAdmin ? 'border-purple-900/30' : 'border-cyan-900/30'}`}>
        <div className="flex items-center gap-3 pb-6 border-b border-slate-800/80 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">CarePulse</h1>
            <Badge variant={isAdmin ? "purple" : "default"}>
              {isAdmin ? "SHADCN ADMIN TEMPLATE" : "CARE PORTAL"}
            </Badge>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {isAdmin ? (
            <>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
                ADMINISTRATIVE MANAGEMENT
              </div>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={18} />
                <span>System Telemetry</span>
              </button>

              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'team' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('team')}
              >
                <Users size={18} />
                <span>Care Team Directory</span>
              </button>

              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'add-member' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('add-member')}
              >
                <UserPlus size={18} />
                <span>Add Team Member</span>
              </button>

              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2 mt-4">
                SYSTEM DISPATCH & ALERTS
              </div>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'sms' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('sms')}
              >
                <MessageSquare size={18} />
                <span>Patient SMS Center</span>
              </button>

              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'telegram' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('telegram')}
              >
                <Radio size={18} />
                <span>Emergency Broadcasts</span>
              </button>

              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2 mt-4">
                SECURITY & PROFILE
              </div>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>Admin Profile Settings</span>
              </button>
            </>
          ) : (
            <>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2">
                STAFF WORKSPACE
              </div>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={18} />
                <span>Staff Portal Overview</span>
              </button>

              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'sms' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('sms')}
              >
                <MessageSquare size={18} />
                <span>Patient SMS Alerts</span>
              </button>

              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'telegram' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('telegram')}
              >
                <Radio size={18} />
                <span>Telegram Channel Bulletins</span>
              </button>

              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 py-2 mt-4">
                ACCOUNT
              </div>
              <button
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} />
                <span>My Profile Settings</span>
              </button>
            </>
          )}
        </nav>

        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span>Session Active</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar Header */}
        <header className="h-17 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={isAdmin ? "text-purple-400" : "text-cyan-400"} size={20} />
            <span className="font-bold text-white text-base">Shadcn Admin Command Workspace</span>
            <Badge variant={isAdmin ? "purple" : "default"}>{roleTitle}</Badge>
          </div>

          <div className="flex items-center gap-4">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw size={14} /> Refresh DB Stats
              </Button>
            )}

            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full py-1 px-3">
              <Avatar src={user?.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"} />
              <div className="flex flex-col text-xs leading-tight">
                <span className="font-bold text-white">{user?.firstName} {user?.lastName}</span>
                <span className="text-slate-400">{user?.email}</span>
              </div>
            </div>

            <Button variant="destructive" size="sm" onClick={onLogout}>
              <LogOut size={15} /> Sign Out
            </Button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
