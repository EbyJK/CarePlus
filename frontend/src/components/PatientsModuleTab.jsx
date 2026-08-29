import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  HeartPulse, 
  Activity, 
  Plus, 
  Trash2, 
  Mail, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download, 
  Send, 
  UserCheck, 
  Shield, 
  X 
} from 'lucide-react';

export default function PatientsModuleTab({ currentUser, isAdmin = false }) {
  const [patients, setPatients] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusAlert, setStatusAlert] = useState(null);

  // Add Patient Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    fullName: '',
    age: 45,
    gender: 'Female',
    bloodGroup: 'O+',
    bloodPressure: '120/80 mmHg',
    oxygenLevel: '98%',
    heartRate: '72 bpm',
  });
  const [savingPatient, setSavingPatient] = useState(false);

  // Send Vitals Report Modal State
  const [selectedPatientForReport, setSelectedPatientForReport] = useState(null);
  const [doctorEmail, setDoctorEmail] = useState('dr.smith@cardiology.org');
  const [dispatchingReport, setDispatchingReport] = useState(false);
  const [reportResult, setReportResult] = useState(null);

  useEffect(() => {
    fetchPatientsData();
    if (isAdmin) {
      fetchStaffList();
    }
  }, [isAdmin]);

  const fetchPatientsData = async () => {
    setLoading(true);
    setStatusAlert(null);
    try {
      const res = await api.getPatients();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setPatients(list);
    } catch (err) {
      console.log('Failed to fetch patients:', err.message);
      setStatusAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const res = await api.getUsers();
      const list = Array.isArray(res) ? res : (res?.data || []);
      setStaffUsers(list);
    } catch (err) {
      console.log('Failed to fetch staff list:', err.message);
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setSavingPatient(true);
    setStatusAlert({ type: 'info', msg: 'Adding new patient to assigned roster...' });
    try {
      const payload = {
        fullName: newPatient.fullName,
        age: Number(newPatient.age) || 45,
        gender: newPatient.gender || 'Female',
        bloodGroup: newPatient.bloodGroup || 'O+',
        bloodPressure: newPatient.bloodPressure || '120/80 mmHg',
        oxygenLevel: newPatient.oxygenLevel || '98%',
        heartRate: newPatient.heartRate || '72 bpm',
      };

      const created = await api.createPatient(payload);
      setStatusAlert({
        type: 'success',
        msg: `Patient ${created.fullName || newPatient.fullName} (ID: #${created.id}) added successfully!`,
      });
      setIsAddModalOpen(false);
      setNewPatient({
        fullName: '',
        age: 45,
        gender: 'Female',
        bloodGroup: 'O+',
        bloodPressure: '120/80 mmHg',
        oxygenLevel: '98%',
        heartRate: '72 bpm',
      });
      fetchPatientsData();
    } catch (err) {
      setStatusAlert({ type: 'error', msg: err.message || 'Failed to add patient' });
    } finally {
      setSavingPatient(false);
    }
  };

  const handleReassign = async (patientId, newStaffId) => {
    if (!newStaffId) return;
    setStatusAlert({ type: 'info', msg: `Reassigning patient #${patientId}...` });
    try {
      const updated = await api.reassignPatient(patientId, String(newStaffId));
      setStatusAlert({
        type: 'success',
        msg: `Patient #${patientId} successfully reassigned to ${updated.assignedStaffName || 'staff member'}!`,
      });
      setPatients((prev) =>
        prev.map((p) =>
          p.id === patientId
            ? {
                ...p,
                assignedStaffId: String(newStaffId),
                assignedStaffName: updated.assignedStaffName || p.assignedStaffName,
              }
            : p
        )
      );
      fetchPatientsData();
    } catch (err) {
      setStatusAlert({ type: 'error', msg: err.message });
    }
  };

  const handleDeletePatient = async (patientObj) => {
    if (!window.confirm(`Are you sure you want to remove patient #${patientObj.id} (${patientObj.fullName})?`)) {
      return;
    }
    setStatusAlert({ type: 'info', msg: `Deleting patient record #${patientObj.id}...` });
    try {
      await api.deletePatient(patientObj.id);
      setStatusAlert({
        type: 'success',
        msg: `Patient record #${patientObj.id} (${patientObj.fullName}) deleted successfully!`,
      });
      fetchPatientsData();
    } catch (err) {
      setStatusAlert({ type: 'error', msg: err.message });
    }
  };

  const handleSendReport = async (e) => {
    e.preventDefault();
    if (!selectedPatientForReport) return;
    setDispatchingReport(true);
    setReportResult(null);
    try {
      const res = await api.sendVitalsPdfReport(selectedPatientForReport.id, {
        doctorEmail,
        senderName: `${currentUser?.firstName || 'Staff'} ${currentUser?.lastName || 'Member'}`,
      });
      setReportResult(res);
      setStatusAlert({
        type: 'success',
        msg: `Clinical Vitals PDF Report for #${selectedPatientForReport.id} dispatched to ${doctorEmail}!`,
      });
    } catch (err) {
      setStatusAlert({ type: 'error', msg: err.message || 'Failed to dispatch report' });
    } finally {
      setDispatchingReport(false);
    }
  };

  const downloadPdfClientSide = (patient) => {
    const reportText = `====================================================
           CAREPULSE CLINICAL VITALS REPORT
====================================================
Date & Time    : ${new Date().toLocaleString()}
Patient Name   : ${patient.fullName}
Patient ID     : #${patient.id}
Age / Gender   : ${patient.age} Yrs / ${patient.gender}
Blood Group    : ${patient.bloodGroup}

----------------------------------------------------
REAL-TIME CLINICAL VITALS & METRICS
----------------------------------------------------
- Blood Pressure (BP) : ${patient.bloodPressure}
- Oxygen Saturation   : ${patient.oxygenLevel} (SpO2)
- Heart Rate (Pulse)  : ${patient.heartRate}

----------------------------------------------------
ASSIGNED STAFF DETAILS
----------------------------------------------------
Staff Member   : ${patient.assignedStaffName || 'Staff Member'}
Staff Email    : ${patient.assignedStaffEmail || 'clinical@carepulse.org'}

Doctor Email   : ${doctorEmail}
Status         : DISPATCH VERIFIED & STAMPED
====================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vitals_Report_Patient_${patient.id}_${patient.fullName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.trim().toLowerCase();
    const cleanQuery = query.replace('#', '');
    const nameMatch = (p.fullName || '').toLowerCase().includes(query);
    const idMatch = cleanQuery.length > 0 && String(p.id).includes(cleanQuery);
    return nameMatch || idMatch;
  });

  return (
    <div className="tab-container">
      {/* Tab Header */}
      <div className="tab-header flex-between">
        <div>
          <h2><HeartPulse className="icon-header text-cyan" /> {isAdmin ? 'Hospital Master Patient Directory' : 'My Assigned Patients & Clinical Vitals'}</h2>
          <p className="subtitle">
            {isAdmin
              ? 'Hospital-wide patient roster. View assigned staff members or re-assign patients.'
              : 'Manage patient care records, track real-time vitals, and email PDF reports to doctors.'}
          </p>
        </div>

        <div className="flex-align gap-2">
          <button onClick={fetchPatientsData} className="btn btn-outline">
            <RefreshCw size={15} /> Refresh Roster
          </button>
          {!isAdmin && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Add New Patient
            </button>
          )}
        </div>
      </div>

      {statusAlert && (
        <div className={`alert alert-${statusAlert.type} mb-3 flex-between`}>
          <div className="flex-align gap-2">
            {statusAlert.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusAlert.msg}</span>
          </div>
          <button onClick={() => setStatusAlert(null)} className="btn btn-sm btn-outline">&times;</button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="card filter-bar-card">
        <div className="search-bar modal-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-align gap-2 font-bold text-muted">
          <span>Total Patients:</span>
          <span className="badge badge-purple">{filteredPatients.length}</span>
        </div>
      </div>

      {/* Patient Cards Grid */}
      {loading ? (
        <div className="card text-center text-muted p-4">Loading patient vitals roster...</div>
      ) : filteredPatients.length === 0 ? (
        <div className="card empty-state-card">
          <HeartPulse size={40} className="text-muted mb-2" />
          <h3>No Patients Found</h3>
          <p className="text-muted">No patient records match your criteria.</p>
          {!isAdmin && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary mt-3">
              <Plus size={16} /> Add First Patient
            </button>
          )}
        </div>
      ) : (
        <div className="shortcut-cards-grid">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="shortcut-box" style={{ overflow: 'hidden' }}>
              <div>
                <div className="flex-between mb-2">
                  <div>
                    <h4 className="member-name-lg">{patient.fullName}</h4>
                    <p className="card-desc">
                      {patient.age} Yrs &bull; {patient.gender} &bull; Blood: <span className="text-cyan font-bold">{patient.bloodGroup}</span>
                    </p>
                  </div>
                  <span className="badge badge-purple">ID: #{patient.id}</span>
                </div>

                {/* Vitals Container */}
                <div className="demo-shortcuts-bar mb-3">
                  <div className="shortcuts-label mb-1 flex-between">
                    <span className="flex-align gap-1">
                      <Activity size={14} className="text-cyan" /> Clinical Vitals:
                    </span>
                    <span className="text-muted text-xs truncate max-w-[120px]" style={{ fontSize: '0.72rem' }}>
                      {patient.assignedStaffName || 'Staff'}
                    </span>
                  </div>
                  <div className="preset-grid flex-between text-center">
                    <div className="flex-1 p-2 border-card rounded">
                      <div className="text-subtle font-bold" style={{ fontSize: '0.68rem' }}>BLOOD PRESSURE</div>
                      <div className="text-cyan font-bold mt-1">{patient.bloodPressure}</div>
                    </div>
                    <div className="flex-1 p-2 border-card rounded">
                      <div className="text-subtle font-bold" style={{ fontSize: '0.68rem' }}>OXYGEN (SPO2)</div>
                      <div className="text-emerald font-bold mt-1">{patient.oxygenLevel}</div>
                    </div>
                    <div className="flex-1 p-2 border-card rounded">
                      <div className="text-subtle font-bold" style={{ fontSize: '0.68rem' }}>HEART RATE</div>
                      <div className="text-amber font-bold mt-1">{patient.heartRate}</div>
                    </div>
                  </div>
                </div>

                {/* Admin Re-assign Controls */}
                {isAdmin && (
                  <div className="mb-3">
                    <label className="text-subtle font-bold block mb-1" style={{ fontSize: '0.75rem' }}>
                      Assigned Staff: <span className="text-white font-bold">{patient.assignedStaffName || 'Staff Member'}</span>
                    </label>
                    <select
                      className="role-select-sm w-full"
                      style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      value={patient.assignedStaffId || ''}
                      onChange={(e) => handleReassign(patient.id, e.target.value)}
                    >
                      <option value="" disabled>Re-assign Staff...</option>
                      {staffUsers.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.firstName} {s.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex-between gap-2 mt-3 pt-2 border-top">
                <button
                  className="btn btn-sm btn-outline flex-1"
                  onClick={() => {
                    setSelectedPatientForReport(patient);
                    setReportResult(null);
                  }}
                >
                  <FileText size={14} className="text-cyan" /> Vitals PDF Report
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeletePatient(patient)}
                  title="Remove patient record"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PATIENT MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            <div className="modal-header-title">
              <HeartPulse className="text-cyan" size={24} />
              <div>
                <h3>Add New Patient Record</h3>
                <p>Register a new patient and record initial clinical vitals.</p>
              </div>
            </div>

            <form onSubmit={handleCreatePatient}>
              <div className="form-group mb-3">
                <label>Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={newPatient.fullName}
                  onChange={(e) => setNewPatient({ ...newPatient, fullName: e.target.value })}
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    required
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-3">
                <label>Blood Group</label>
                <input
                  type="text"
                  placeholder="e.g. O+"
                  value={newPatient.bloodGroup}
                  onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                />
              </div>

              <div className="form-row mb-3">
                <div className="form-group">
                  <label>Blood Pressure</label>
                  <input
                    type="text"
                    placeholder="120/80 mmHg"
                    value={newPatient.bloodPressure}
                    onChange={(e) => setNewPatient({ ...newPatient, bloodPressure: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Oxygen Level (SpO2)</label>
                  <input
                    type="text"
                    placeholder="98%"
                    value={newPatient.oxygenLevel}
                    onChange={(e) => setNewPatient({ ...newPatient, oxygenLevel: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group mb-4">
                <label>Heart Rate (Pulse)</label>
                <input
                  type="text"
                  placeholder="72 bpm"
                  value={newPatient.heartRate}
                  onChange={(e) => setNewPatient({ ...newPatient, heartRate: e.target.value })}
                />
              </div>

              <div className="flex-align justify-end gap-2">
                <button type="button" className="btn btn-outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald" disabled={savingPatient}>
                  <Plus size={16} /> {savingPatient ? 'Adding...' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VITALS REPORT EMAIL MODAL */}
      {selectedPatientForReport && (
        <div className="modal-overlay" style={{ overflowY: 'auto', padding: '2rem 1rem' }}>
          <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={() => setSelectedPatientForReport(null)}>&times;</button>
            <div className="modal-header-title">
              <FileText className="text-cyan" size={24} />
              <div>
                <h3>Send Clinical Vitals PDF Report</h3>
                <p>Patient: {selectedPatientForReport.fullName} (ID: #{selectedPatientForReport.id})</p>
              </div>
            </div>

            <div className="demo-shortcuts-bar mb-3">
              <div className="flex-between mb-2 font-bold">
                <span>Vitals Snapshot:</span>
                <span className="badge badge-emerald">{selectedPatientForReport.bloodGroup}</span>
              </div>
              <div className="form-row text-center font-bold">
                <div className="shortcut-box p-2">
                  <span className="text-subtle" style={{ fontSize: '0.68rem' }}>BP</span>
                  <span className="text-cyan block">{selectedPatientForReport.bloodPressure}</span>
                </div>
                <div className="shortcut-box p-2">
                  <span className="text-subtle" style={{ fontSize: '0.68rem' }}>SPO2</span>
                  <span className="text-emerald block">{selectedPatientForReport.oxygenLevel}</span>
                </div>
                <div className="shortcut-box p-2">
                  <span className="text-subtle" style={{ fontSize: '0.68rem' }}>PULSE</span>
                  <span className="text-amber block">{selectedPatientForReport.heartRate}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendReport}>
              <div className="form-group mb-3">
                <label>Doctor Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="dr.smith@cardiology.org"
                  value={doctorEmail}
                  onChange={(e) => setDoctorEmail(e.target.value)}
                />
              </div>

              <div className="flex-between gap-2 mt-4 mb-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => downloadPdfClientSide(selectedPatientForReport)}
                >
                  <Download size={15} /> Download PDF
                </button>

                <button type="submit" className="btn btn-emerald" disabled={dispatchingReport}>
                  <Send size={15} /> {dispatchingReport ? 'Sending...' : 'Email PDF Report'}
                </button>
              </div>
            </form>

            {reportResult && (
              <div className="alert alert-success mt-3 flex-column">
                <div className="flex-align gap-2 font-bold mb-1">
                  <CheckCircle2 size={16} />
                  <span>{reportResult.message}</span>
                </div>
                <pre className="json-preview">
                  {reportResult.pdfSummary}
                </pre>
              </div>
            )}

            <div className="flex-between border-top pt-3 mt-3">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={() => setSelectedPatientForReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
