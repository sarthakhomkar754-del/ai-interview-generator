import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Shield, Users, Layers, Code, Briefcase, Plus, Trash2, Edit, Save, X, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Toast from '../components/common/Toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data states
  const [questions, setQuestions] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [users, setUsers] = useState([]);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Modals & Forms
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create_question', 'create_tech', 'create_role', 'create_category'
  const [editingItem, setEditingItem] = useState(null);

  // Form fields
  const [qText, setQText] = useState('');
  const [qAns, setQAns] = useState('');
  const [qTech, setQTech] = useState('');
  const [qRole, setQRole] = useState('');
  const [qLevel, setQLevel] = useState('');
  const [qCat, setQCat] = useState('');
  const [qDiff, setQDiff] = useState('');

  const [techName, setTechName] = useState('');
  const [techDesc, setTechDesc] = useState('');

  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');

  const [catName, setCatName] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, qRes, techRes, roleRes, catRes, diffRes, levelRes, userRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/questions'),
        api.get('/technologies'),
        api.get('/job-roles'),
        api.get('/categories'),
        api.get('/difficulties'),
        api.get('/experience-levels'),
        api.get('/admin/users'),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (qRes.success) setQuestions(qRes.data);
      if (techRes.success) setTechnologies(techRes.data);
      if (roleRes.success) setJobRoles(roleRes.data);
      if (catRes.success) setCategories(catRes.data);
      if (diffRes.success) setDifficulties(diffRes.data);
      if (levelRes.success) setExperienceLevels(levelRes.data);
      if (userRes.success) setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  // Delete Handlers
  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${id}`);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      showToast('Question deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete question', 'error');
    }
  };

  const handleDeleteTech = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technology?')) return;
    try {
      await api.delete(`/technologies/${id}`);
      setTechnologies((prev) => prev.filter((t) => t.id !== id));
      showToast('Technology deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete technology', 'error');
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job role?')) return;
    try {
      await api.delete(`/job-roles/${id}`);
      setJobRoles((prev) => prev.filter((r) => r.id !== id));
      showToast('Job role deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete job role', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast('User deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  const handleToggleUserRole = async (user) => {
    const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_USER' : 'ROLE_ADMIN';
    try {
      const res = await api.put(`/admin/users/${user.id}/role`, { role: newRole });
      if (res.success) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
        showToast(`User role updated to ${newRole}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  // Submit Handlers for Creating/Editing
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        question: qText,
        answer: qAns,
        technologyId: Number(qTech),
        jobRoleId: Number(qRole),
        experienceLevelId: Number(qLevel),
        categoryId: Number(qCat),
        difficultyId: Number(qDiff),
      };

      if (editingItem) {
        const res = await api.put(`/questions/${editingItem.id}`, payload);
        if (res.success) {
          showToast('Question updated successfully');
          fetchAdminData();
        }
      } else {
        const res = await api.post('/questions', payload);
        if (res.success) {
          showToast('Question created successfully');
          fetchAdminData();
        }
      }
      closeModal();
    } catch (err) {
      showToast(err.message || 'Failed to save question', 'error');
    }
  };

  const handleSaveTech = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/technologies/${editingItem.id}`, { technologyName: techName, description: techDesc });
        showToast('Technology updated successfully');
      } else {
        await api.post('/technologies', { technologyName: techName, description: techDesc });
        showToast('Technology created successfully');
      }
      fetchAdminData();
      closeModal();
    } catch (err) {
      showToast(err.message || 'Failed to save technology', 'error');
    }
  };

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/job-roles/${editingItem.id}`, { roleName: roleName, description: roleDesc });
        showToast('Job role updated successfully');
      } else {
        await api.post('/job-roles', { roleName: roleName, description: roleDesc });
        showToast('Job role created successfully');
      }
      fetchAdminData();
      closeModal();
    } catch (err) {
      showToast(err.message || 'Failed to save job role', 'error');
    }
  };

  const handleSaveCat = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { categoryName: catName });
      showToast('Category created successfully');
      fetchAdminData();
      closeModal();
    } catch (err) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const openCreateQuestionModal = (item = null) => {
    setEditingItem(item);
    setModalType('question');
    if (item) {
      setQText(item.question);
      setQAns(item.answer);
      setQTech(item.technologyId);
      setQRole(item.jobRoleId);
      setQLevel(item.experienceLevelId);
      setQCat(item.categoryId);
      setQDiff(item.difficultyId);
    } else {
      setQText('');
      setQAns('');
      setQTech(technologies[0]?.id || '');
      setQRole(jobRoles[0]?.id || '');
      setQLevel(experienceLevels[0]?.id || '');
      setQCat(categories[0]?.id || '');
      setQDiff(difficulties[0]?.id || '');
    }
    setModalOpen(true);
  };

  const openCreateTechModal = (item = null) => {
    setEditingItem(item);
    setModalType('tech');
    setTechName(item ? item.technologyName : '');
    setTechDesc(item ? item.description : '');
    setModalOpen(true);
  };

  const openCreateRoleModal = (item = null) => {
    setEditingItem(item);
    setModalType('role');
    setRoleName(item ? item.roleName : '');
    setRoleDesc(item ? item.description : '');
    setModalOpen(true);
  };

  const openCreateCatModal = () => {
    setEditingItem(null);
    setModalType('category');
    setCatName('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  if (loading) return <LoadingSpinner text="Loading admin control panel..." />;

  return (
    <div className="space-y-8">
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Admin Banner */}
      <div className="glass-card p-8 rounded-3xl border border-indigo-200/50 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Administration
          </h1>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center space-x-3 text-sm font-semibold">
          <span className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
            {stats?.totalUsers || 0} Users
          </span>
          <span className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
            {stats?.totalQuestions || 0} Questions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: 'questions', name: `Questions (${questions.length})`, icon: Layers },
          { id: 'technologies', name: `Technologies (${technologies.length})`, icon: Code },
          { id: 'job_roles', name: `Job Roles (${jobRoles.length})`, icon: Briefcase },
          { id: 'categories', name: `Categories (${categories.length})`, icon: Sparkles },
          { id: 'users', name: `Users (${users.length})`, icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      
      {/* 1. Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Questions</h2>
            <button
              onClick={() => openCreateQuestionModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Question</span>
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {q.technologyName}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.jobRoleName}
                    </span>
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {q.experienceLevelName}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{q.question}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{q.answer}</p>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-auto">
                  <button
                    onClick={() => openCreateQuestionModal(q)}
                    className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    title="Edit Question"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Technologies Tab */}
      {activeTab === 'technologies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Technologies</h2>
            <button
              onClick={() => openCreateTechModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Technology</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {technologies.map((t) => (
              <div key={t.id} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white">{t.technologyName}</h3>
                  <div className="flex space-x-1">
                    <button onClick={() => openCreateTechModal(t)} className="p-1 text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTech(t.id)} className="p-1 text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Job Roles Tab */}
      {activeTab === 'job_roles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Job Roles</h2>
            <button
              onClick={() => openCreateRoleModal()}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Job Role</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {jobRoles.map((r) => (
              <div key={r.id} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white">{r.roleName}</h3>
                  <div className="flex space-x-1">
                    <button onClick={() => openCreateRoleModal(r)} className="p-1 text-indigo-600">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteRole(r.id)} className="p-1 text-rose-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{r.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Categories</h2>
            <button
              onClick={openCreateCatModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center space-x-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((c) => (
              <div key={c.id} className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{c.categoryName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Users Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Registered System Users</h2>
          <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-bold">User Name</th>
                  <th className="px-6 py-4 font-bold">Email</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleUserRole(u)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        Toggle Role
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="glass-card bg-white dark:bg-slate-900 max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Question Modal Form */}
            {modalType === 'question' && (
              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Question Text</label>
                  <textarea
                    required
                    rows={3}
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Answer / Solution</label>
                  <textarea
                    required
                    rows={4}
                    value={qAns}
                    onChange={(e) => setQAns(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Technology</label>
                    <select value={qTech} onChange={(e) => setQTech(e.target.value)} className="w-full p-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800">
                      {technologies.map((t) => <option key={t.id} value={t.id}>{t.technologyName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Job Role</label>
                    <select value={qRole} onChange={(e) => setQRole(e.target.value)} className="w-full p-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800">
                      {jobRoles.map((r) => <option key={r.id} value={r.id}>{r.roleName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Experience Level</label>
                    <select value={qLevel} onChange={(e) => setQLevel(e.target.value)} className="w-full p-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800">
                      {experienceLevels.map((l) => <option key={l.id} value={l.id}>{l.levelName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <select value={qCat} onChange={(e) => setQCat(e.target.value)} className="w-full p-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800">
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.categoryName}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Difficulty</label>
                  <select value={qDiff} onChange={(e) => setQDiff(e.target.value)} className="w-full p-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800">
                    {difficulties.map((d) => <option key={d.id} value={d.id}>{d.difficultyName}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save Question</button>
              </form>
            )}

            {/* Tech Form */}
            {modalType === 'tech' && (
              <form onSubmit={handleSaveTech} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Technology Name</label>
                  <input required value={techName} onChange={(e) => setTechName(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Description</label>
                  <textarea rows={3} value={techDesc} onChange={(e) => setTechDesc(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800 text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save Technology</button>
              </form>
            )}

            {/* Role Form */}
            {modalType === 'role' && (
              <form onSubmit={handleSaveRole} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Role Name</label>
                  <input required value={roleName} onChange={(e) => setRoleName(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Description</label>
                  <textarea rows={3} value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800 text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save Role</button>
              </form>
            )}

            {/* Category Form */}
            {modalType === 'category' && (
              <form onSubmit={handleSaveCat} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Category Name</label>
                  <input required value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full p-3 rounded-xl border bg-white dark:bg-slate-800 text-sm" />
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl">Save Category</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
