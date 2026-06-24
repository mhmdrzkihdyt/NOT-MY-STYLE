import { useState, useEffect } from 'react';
import { Clock, Trophy, Sparkles, Star, Home, Play, Trash2, TestTube2, CheckCircle2, Plus, Heart, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { PREDEFINED_PROPERTIES, PREDEFINED_CATEGORIES, CSS_MATERIALS, ALL_DASAR_LEVELS, ALL_TANTANGAN_LEVELS, getDisplayValue } from './gameData';
import type { Level, PropertyConfig } from './gameData';
import * as api from './api';

interface CSSProperties {
  [key: string]: string;
}

interface LevelProgress {
  stars?: number;
  unlocked: boolean;
  timeUsed?: number;
}

interface PlayerAccount {
  name: string;
  username: string;
  email: string;
  password: string;
  totalScore: number;
  levelsPlayed: number;
  stars: number;
  totalTime: number;
  lives: number;
  levelProgress: Record<string, LevelProgress>;
  createdAt: string;
}

const DEFAULT_PLAYERS: PlayerAccount[] = [
  { name: 'Player Satu', username: 'player1', email: 'player1@email.com', password: 'player123', totalScore: 0, levelsPlayed: 0, stars: 0, totalTime: 0, lives: 3, levelProgress: {}, createdAt: '2026-06-01' },
];

const CARD_COLORS = [
  { bg: '#FFD93D', text: '#0B0B16', badge: '#0B0B16', badgeText: '#FFD93D' },
  { bg: '#6C5CE7', text: '#FFFFFF', badge: '#FFD93D', badgeText: '#0B0B16' },
  { bg: '#1591DC', text: '#FFFFFF', badge: '#FFD93D', badgeText: '#0B0B16' },
];

const HTML_TEMPLATES: { name: string; icon: string; html: string; description: string; suggestedProps: string[] }[] = [
  {
    name: 'Profile Card',
    icon: '👤',
    description: 'Kartu profil dengan avatar, nama, dan jabatan',
    suggestedProps: ['text-align', 'padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'width', 'color'],
    html: `<div id="target" style="padding: 24px; background-color: #f3f4f6; border-radius: 16px; width: 300px; text-align: center;">
  <div style="font-size: 48px; margin-bottom: 12px;">👤</div>
  <h2>Nama Profil</h2>
  <p>UI/UX Designer</p>
</div>`,
  },
  {
    name: 'Hero Section',
    icon: '🚀',
    description: 'Hero banner dengan judul dan subjudul',
    suggestedProps: ['text-align', 'padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'letter-spacing', 'color'],
    html: `<div id="target" style="padding: 32px; background-color: #dbeafe; border-radius: 20px; text-align: center;">
  <h1>Judul Hero Section</h1>
  <p>Subjudul atau deskripsi singkat di sini.</p>
</div>`,
  },
  {
    name: 'Product Card',
    icon: '📦',
    description: 'Kartu produk dengan ikon, nama, dan harga',
    suggestedProps: ['padding', 'border-radius', 'background-color', 'text-align', 'font-size', 'font-weight', 'width', 'color'],
    html: `<div id="target" style="padding: 24px; background-color: #ffffff; border-radius: 12px; width: 250px; text-align: center;">
  <div style="font-size: 42px; margin-bottom: 10px;">📦</div>
  <h3>Nama Produk</h3>
  <p>Rp 99.000</p>
</div>`,
  },
  {
    name: 'Testimonial Card',
    icon: '💬',
    description: 'Kartu kutipan testimonial pengguna',
    suggestedProps: ['padding', 'border-radius', 'background-color', 'letter-spacing', 'font-size', 'opacity', 'color'],
    html: `<div id="target" style="padding: 28px; background-color: #ffffff; border-radius: 16px;">
  <div style="font-size: 36px; margin-bottom: 10px;">💬</div>
  <p>Produk ini sangat luar biasa!</p>
  <p>— Sarah Johnson</p>
</div>`,
  },
  {
    name: 'Pricing Card',
    icon: '💎',
    description: 'Kartu harga paket layanan',
    suggestedProps: ['text-align', 'padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'width', 'letter-spacing'],
    html: `<div id="target" style="padding: 32px; background-color: #ede9fe; border-radius: 16px; text-align: center; width: 250px;">
  <h2>Paket Premium</h2>
  <h1>Rp 199K</h1>
  <p>per bulan</p>
</div>`,
  },
  {
    name: 'Notification Banner',
    icon: '🔔',
    description: 'Banner notifikasi dengan ikon dan pesan',
    suggestedProps: ['padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'display', 'gap', 'align-items'],
    html: `<div id="target" style="padding: 16px; background-color: #dbeafe; border-radius: 12px; display: flex; gap: 12px; align-items: center;">
  <span style="font-size: 24px;">🔔</span>
  <div>
    <h3>Notifikasi Penting</h3>
    <p>Deskripsi notifikasi muncul di sini.</p>
  </div>
</div>`,
  },
  {
    name: 'Stat Card',
    icon: '📊',
    description: 'Kartu statistik angka besar',
    suggestedProps: ['text-align', 'padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'width', 'opacity'],
    html: `<div id="target" style="padding: 24px; background-color: #ffffff; border-radius: 16px; width: 200px; text-align: center;">
  <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
  <h1>1,234</h1>
  <p>Total Pengunjung</p>
</div>`,
  },
  {
    name: 'Feature Box',
    icon: '⚡',
    description: 'Kotak fitur dengan ikon, judul, dan deskripsi',
    suggestedProps: ['text-align', 'padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'width', 'height'],
    html: `<div id="target" style="padding: 24px; background-color: #d1fae5; border-radius: 12px; text-align: center; width: 250px;">
  <div style="font-size: 40px; margin-bottom: 12px;">⚡</div>
  <h3>Fitur Unggulan</h3>
  <p>Deskripsi fitur unggulan.</p>
</div>`,
  },
  {
    name: 'Flex List',
    icon: '📝',
    description: 'Daftar item dengan layout flex',
    suggestedProps: ['padding', 'background-color', 'display', 'gap', 'align-items', 'justify-content', 'border-radius'],
    html: `<div id="target" style="padding: 16px; background-color: #f3f4f6; border-radius: 12px; display: flex; flex-direction: column; gap: 8px;">
  <div style="background: #dbeafe; padding: 12px; border-radius: 8px;">Item 1</div>
  <div style="background: #d1fae5; padding: 12px; border-radius: 8px;">Item 2</div>
  <div style="background: #fef3c7; padding: 12px; border-radius: 8px;">Item 3</div>
</div>`,
  },
  {
    name: 'Badge / Label',
    icon: '🏷️',
    description: 'Label status sederhana',
    suggestedProps: ['padding', 'border-radius', 'background-color', 'font-size', 'font-weight', 'letter-spacing', 'text-align', 'color'],
    html: `<div id="target" style="padding: 8px; background-color: #4ade80; border-radius: 20px; text-align: center; width: 200px;">
  <h3>Status Aktif</h3>
</div>`,
  },
];

const DIFF_COLORS: Record<Level['difficulty'], { pill: string; text: string }> = {
  Mudah:  { pill: '#4ADE80', text: '#052e16' },
  Sedang: { pill: '#FFD93D', text: '#0B0B16' },
  Sulit:  { pill: '#FF6B6B', text: '#ffffff' },
};

export default function App() {
  const [screen, setScreen] = useState<'splash' | 'login' | 'register' | 'player-gallery' | 'gameplay' | 'creator' | 'developer'>('splash');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<'player' | 'developer' | null>('player');
  const [loginError, setLoginError] = useState('');
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'player' | 'developer' } | null>(null);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Player accounts
  const [players, setPlayers] = useState<PlayerAccount[]>(DEFAULT_PLAYERS);

  // Developer state
  const [devTab, setDevTab] = useState<'overview' | 'players' | 'levels'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [viewPlayerUsername, setViewPlayerUsername] = useState<string | null>(null);
  const [editPlayerUsername, setEditPlayerUsername] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const [levels, setLevels] = useState<Level[]>([...ALL_DASAR_LEVELS, ...ALL_TANTANGAN_LEVELS]);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [playerValues, setPlayerValues] = useState<CSSProperties>({});

  const [globalLives, setGlobalLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [showReviveSuccessModal, setShowReviveSuccessModal] = useState(false);
  const [showReviveModal, setShowReviveModal] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ question: '', answer: 0 });
  const [mathInput, setMathInput] = useState('');
  const [reviveCountdown, setReviveCountdown] = useState(0); // seconds remaining
  const [reviveLivesQueue, setReviveLivesQueue] = useState(0); // lives waiting to restore
  const [hintRevealed, setHintRevealed] = useState<{ property: string; hint: string }[]>([]);
  const [showMathErrorModal, setShowMathErrorModal] = useState(false);
  const [showSaveLevelModal, setShowSaveLevelModal] = useState(false);
  const [showCreatorErrorModal, setShowCreatorErrorModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [showLivesClickModal, setShowLivesClickModal] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showLearningPopup, setShowLearningPopup] = useState(false);
  const [isInitialPopup, setIsInitialPopup] = useState(false);
  const [learningLevel, setLearningLevel] = useState<Level | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpSelectedProp, setHelpSelectedProp] = useState<string | null>(null);
  const [showTantanganIntro, setShowTantanganIntro] = useState(false);
  const [tantanganIntroLevel, setTantanganIntroLevel] = useState<Level | null>(null);
  const [galleryView, setGalleryView] = useState<'main' | 'dasar' | 'tantangan' | 'custom'>('main');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit' | null>(null);
  const [showDifficultyLockPopup, setShowDifficultyLockPopup] = useState<'Sedang' | 'Sulit' | null>(null);
  const [loading, setLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<api.LeaderboardEntry[]>([]);
  const [devPlayers, setDevPlayers] = useState<api.PlayerData[]>([]);
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());
  const [devLeaderboard, setDevLeaderboard] = useState<api.LeaderboardEntry[]>([]);
  const [devLeaderboardLoading, setDevLeaderboardLoading] = useState(false);

  // Creator state
  const [creatorTitle, setCreatorTitle] = useState('');
  const [creatorLevelType, setCreatorLevelType] = useState<'dasar' | 'tantangan'>('tantangan');
  const [creatorDifficulty, setCreatorDifficulty] = useState<'Mudah' | 'Sedang' | 'Sulit'>('Mudah');
  const [creatorCategory, setCreatorCategory] = useState<'Visual' | 'Typography' | 'Spacing' | 'Layout'>('Visual');
  const [creatorLevelOrder, setCreatorLevelOrder] = useState(1);
  const [creatorChallengeNumber, setCreatorChallengeNumber] = useState(1);
  const [creatorDescription, setCreatorDescription] = useState('');
  const [creatorHtml, setCreatorHtml] = useState('');
  const [creatorTimeLimit, setCreatorTimeLimit] = useState(120);
  const [creatorProperties, setCreatorProperties] = useState<PropertyConfig[]>([
    { name: 'text-align', initialValue: 'left', targetValue: 'center' },
  ]);
  const [selectedPropToAdd, setSelectedPropToAdd] = useState<string>('font-size');

  // Auto-suggest time based on difficulty/challenge
  useEffect(() => {
    if (creatorLevelType === 'dasar') {
      const timeMap = { 'Mudah': 60, 'Sedang': 90, 'Sulit': 120 };
      setCreatorTimeLimit(timeMap[creatorDifficulty]);
    } else {
      const challengeTimeMap: Record<number, number> = { 1: 120, 2: 150, 3: 180, 4: 210, 5: 300 };
      setCreatorTimeLimit(challengeTimeMap[creatorChallengeNumber] || 120);
    }
  }, [creatorLevelType, creatorDifficulty, creatorChallengeNumber]);

  // Auto-suggest CSS properties based on category + difficulty
  const getSuggestedProperties = (): string[] => {
    if (creatorLevelType === 'tantangan') return []; // Tantangan: manual selection
    const categoryProps: Record<string, string[]> = {
      'Visual': ['background-color', 'color', 'border-radius', 'opacity'],
      'Typography': ['font-size', 'font-weight', 'text-align', 'letter-spacing'],
      'Spacing': ['padding', 'margin', 'gap'],
      'Layout': ['display', 'width', 'height', 'align-items', 'justify-content'],
    };
    const props = categoryProps[creatorCategory] || [];
    const count = creatorDifficulty === 'Mudah' ? 1 : creatorDifficulty === 'Sedang' ? 2 : 3;
    return props.slice(0, count);
  };

  // ─── LOAD DEV PLAYERS WHEN TAB CHANGES ────────────────────────────────────
  useEffect(() => {
    if (devTab === 'players' && currentUser?.role === 'developer') {
      api.getPlayers()
        .then(data => {
          // Normalize field names (SQL Server may return PascalCase)
          const normalized = (data || []).map((p: any) => ({
            id: p.id || p.Id || 0,
            name: p.name || p.Name || '-',
            username: p.username || p.Username || '-',
            email: p.email || p.Email || '-',
            password: p.password || p.Password || '',
            role: p.role || p.Role || 'player',
            lives: p.lives ?? p.Lives ?? 3,
            totalScore: p.totalScore ?? p.TotalScore ?? 0,
            levelsPlayed: p.levelsPlayed ?? p.LevelsPlayed ?? 0,
            stars: p.stars ?? p.TotalStars ?? 0,
            totalTime: p.totalTime ?? p.TotalTime ?? 0,
            createdAt: p.createdAt || p.CreatedAt || '',
          }));
          setDevPlayers(normalized);
        })
        .catch(err => {
          console.error('[API] Failed to load players:', err.message);
          // Fallback: use local players state
          setDevPlayers(players.map(p => ({
            id: 0, name: p.name || '-', username: p.username || '-', email: p.email || '-',
            password: p.password || '', role: 'player', lives: p.lives,
            totalScore: p.totalScore, levelsPlayed: p.levelsPlayed,
            stars: p.stars, totalTime: p.totalTime, createdAt: p.createdAt,
          })));
        });
    }
  }, [devTab, currentUser]);

  // ─── LOAD DEV LEADERBOARD WHEN OVERVIEW TAB ─────────────────────────────
  useEffect(() => {
    if (devTab === 'overview' && currentUser?.role === 'developer') {
      setDevLeaderboardLoading(true);
      api.getLeaderboard()
        .then(data => {
          setDevLeaderboard(data);
          localStorage.setItem('nms_dev_leaderboard', JSON.stringify(data));
          setDevLeaderboardLoading(false);
        })
        .catch(err => {
          console.error('[API] Failed to load dev leaderboard:', err.message);
          // Fallback: try localStorage
          const cached = localStorage.getItem('nms_dev_leaderboard');
          if (cached) {
            try { setDevLeaderboard(JSON.parse(cached)); } catch {}
          }
          setDevLeaderboardLoading(false);
        });
    }
  }, [devTab, currentUser]);

  // ─── AUTO-LOGIN ON APP LOAD ───────────────────────────────────────────────
  useEffect(() => {
    if (api.isLoggedIn()) {
      api.getMe().then(user => {
        setCurrentUser({ username: user.username, role: user.role as 'player' | 'developer' });
        setGlobalLives(user.lives);
        applyPlayerProgress(user.levelProgress);
        // Restore revive countdown from localStorage if still active
        if (user.lives < 3) {
          const savedEnd = localStorage.getItem('nms_revive_end');
          const savedQueue = localStorage.getItem('nms_revive_queue');
          if (savedEnd && savedQueue) {
            const endTime = parseInt(savedEnd, 10);
            const queue = parseInt(savedQueue, 10);
            const remaining = Math.floor((endTime - Date.now()) / 1000);
            if (remaining > 0 && queue > 0) {
              setReviveLivesQueue(queue);
              setReviveCountdown(remaining);
            }
          }
        }
        setScreen(user.role === 'developer' ? 'developer' : 'player-gallery');
      }).catch(() => {
        // Fallback: try to restore from localStorage
        const savedProgress = localStorage.getItem('nms_level_progress');
        if (savedProgress) {
          try { applyPlayerProgress(JSON.parse(savedProgress)); } catch {}
        }
        const savedUser = api.getCurrentUser();
        if (savedUser) {
          setCurrentUser({ username: savedUser.username, role: savedUser.role as 'player' | 'developer' });
          setGlobalLives(savedUser.lives);
          // Restore countdown
          if (savedUser.lives < 3) {
            const savedEnd = localStorage.getItem('nms_revive_end');
            const savedQueue = localStorage.getItem('nms_revive_queue');
            if (savedEnd && savedQueue) {
              const endTime = parseInt(savedEnd, 10);
              const queue = parseInt(savedQueue, 10);
              const remaining = Math.floor((endTime - Date.now()) / 1000);
              if (remaining > 0 && queue > 0) {
                setReviveLivesQueue(queue);
                setReviveCountdown(remaining);
              }
            }
          }
          setScreen(savedUser.role === 'developer' ? 'developer' : 'player-gallery');
        } else {
          api.logout();
        }
      });
    }
  }, []);

  // ─── SAVE LEVEL PROGRESS TO LOCALSTORAGE ─────────────────────────────────
  useEffect(() => {
    const progress: Record<string, LevelProgress> = {};
    levels.forEach(l => {
      if (l.stars !== undefined) {
        progress[l.id] = { stars: l.stars, unlocked: !l.isLocked };
      }
    });
    if (Object.keys(progress).length > 0) {
      localStorage.setItem('nms_level_progress', JSON.stringify(progress));
    }
  }, [levels]);

  // ─── SYNC LIVES TO PLAYER ACCOUNT ─────────────────────────────────────────
  useEffect(() => {
    if (currentUser?.role === 'player') {
      setPlayers(prev => prev.map(p =>
        p.username === currentUser.username ? { ...p, lives: globalLives } : p
      ));
    }
  }, [globalLives, currentUser]);

  // ─── TIMERS ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Timer runs during gameplay. Paused only for initial learning popup (not help popup).
    const isPausedByInitialPopup = showLearningPopup && isInitialPopup;
    if (screen === 'gameplay' && timeLeft > 0 && !showWinModal && !isPausedByInitialPopup) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && screen === 'gameplay' && !showWinModal) {
      handleTimeUp();
    }
  }, [timeLeft, screen, showWinModal, showLearningPopup, isInitialPopup]);

  // ─── LIVE PREVIEW: apply playerValues & targetValues ────────────────────
  useEffect(() => {
    if (screen !== 'gameplay' || !currentLevel) return;

    const TYPOGRAPHY = ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align'];

    const applyToPreview = (previewId: string, values: CSSProperties) => {
      const preview = document.getElementById(previewId);
      if (!preview) return;
      const targetEl = preview.querySelector('#target') as HTMLElement | null;
      if (!targetEl) return;

      Object.entries(values).forEach(([key, val]) => {
        targetEl.style.setProperty(key, val, 'important');
      });

      // Typography inherits — also force onto text children to override inline styles
      const textEls = targetEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,div,button');
      textEls.forEach(el => {
        Object.entries(values).forEach(([key, val]) => {
          if (TYPOGRAPHY.includes(key)) {
            (el as HTMLElement).style.setProperty(key, val, 'important');
          }
        });
      });
    };

    const targetValues: CSSProperties = Object.fromEntries(
      currentLevel.propertyConfigs.map(p => [p.name, p.targetValue])
    );

    applyToPreview('player-preview', playerValues);
    applyToPreview('target-preview', targetValues);
  }, [playerValues, currentLevel, screen]);

  // ─── REVIVE COUNTDOWN ─────────────────────────────────────────────────────
  useEffect(() => {
    // If lives are already full (3/3), stop the countdown entirely
    if (globalLives >= 3) {
      setReviveCountdown(0);
      setReviveLivesQueue(0);
      localStorage.removeItem('nms_revive_end');
      localStorage.removeItem('nms_revive_queue');
      return;
    }
    if (reviveCountdown > 0) {
      const timer = setTimeout(() => setReviveCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else if (reviveCountdown === 0 && reviveLivesQueue > 0) {
      // Restore 1 life, start next countdown if more lives queued
      setGlobalLives(prev => {
        const newLives = Math.min(3, prev + 1);
        if (currentUser) {
          api.updateLives(currentUser.username, newLives).catch(() => {});
        }
        // If lives reach 3 after restore, clear everything
        if (newLives >= 3) {
          setReviveLivesQueue(0);
          localStorage.removeItem('nms_revive_end');
          localStorage.removeItem('nms_revive_queue');
          setShowReviveSuccessModal(true);
        }
        return newLives;
      });
      const remaining = reviveLivesQueue - 1;
      if (remaining > 0) {
        setReviveLivesQueue(remaining);
        const endTime = Date.now() + 300_000;
        localStorage.setItem('nms_revive_end', endTime.toString());
        localStorage.setItem('nms_revive_queue', remaining.toString());
        setReviveCountdown(300); // 5 minutes for next life
      } else {
        setReviveLivesQueue(0);
        localStorage.removeItem('nms_revive_end');
        localStorage.removeItem('nms_revive_queue');
        setShowReviveSuccessModal(true);
      }
    }
  }, [reviveCountdown, reviveLivesQueue, globalLives]);

  // ─── SYNC CONTAINER HEIGHTS ─────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'gameplay' || !currentLevel) return;
    const sync = () => {
      const tgt = document.getElementById('target-container');
      const ply = document.getElementById('player-container');
      if (tgt && ply) ply.style.height = `${tgt.offsetHeight}px`;
    };
    sync();
    const id = setTimeout(sync, 100);
    return () => clearTimeout(id);
  }, [currentLevel, screen]);

  // ─── CREATOR LIVE PREVIEW ────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== 'creator') return;
    const TYPOGRAPHY = ['font-size', 'font-weight', 'line-height', 'letter-spacing', 'text-align'];

    const applyToCreatorPreview = (containerId: string, values: CSSProperties) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const targetEl = container.querySelector('#target') as HTMLElement | null;
      if (!targetEl) return;

      // Clear previous !important overrides first
      TYPOGRAPHY.concat(['padding', 'margin-top', 'width', 'max-width', 'border-radius', 'opacity', 'box-shadow', 'background-color']).forEach(key => {
        targetEl.style.removeProperty(key);
      });

      Object.entries(values).forEach(([key, val]) => {
        targetEl.style.setProperty(key, val, 'important');
      });

      const textEls = targetEl.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,a,div,button');
      textEls.forEach(el => {
        Object.entries(values).forEach(([key, val]) => {
          if (TYPOGRAPHY.includes(key)) {
            (el as HTMLElement).style.setProperty(key, val, 'important');
          }
        });
      });
    };

    const tVals: CSSProperties = Object.fromEntries(creatorProperties.map(p => [p.name, p.targetValue]));
    const iVals: CSSProperties = Object.fromEntries(creatorProperties.map(p => [p.name, p.initialValue]));

    // Small delay to let DOM render after HTML change
    const timer = setTimeout(() => {
      applyToCreatorPreview('creator-target-preview', tVals);
      applyToCreatorPreview('creator-player-preview', iVals);
    }, 50);
    return () => clearTimeout(timer);
  }, [screen, creatorHtml, creatorProperties]);

  // ─── GAME LOGIC ─────────────────────────────────────────────────────────
  const handleTimeUp = () => {
    const lives = globalLives - 1;
    setGlobalLives(lives);
    if (lives <= 0) {
      setShowWinModal(false);
      setShowValidationModal(false);
      setCurrentLevel(null);
      if (!testMode) setScreen('player-gallery');
      setTimeout(() => setShowReviveModal(true), 300);
    } else {
      // Reset level: restart timer and reset player values to initial
      setTimeLeft(currentLevel?.timeLimit || 90);
      if (currentLevel) {
        const initial: CSSProperties = Object.fromEntries(
          currentLevel.propertyConfigs.map(p => [p.name, p.initialValue])
        );
        setPlayerValues(initial);
      }
      setHintsUsed(0);
      setHintRevealed([]);
    }
  };

  const calculateMatchPercentage = (): number => {
    if (!currentLevel) return 0;
    const configs = currentLevel.propertyConfigs;
    if (configs.length === 0) return 0;
    let matches = 0;
    configs.forEach(c => {
      const pv = (playerValues[c.name] || '').trim().toLowerCase();
      const tv = c.targetValue.trim().toLowerCase();
      if (pv === tv) matches++;
    });
    return Math.round((matches / configs.length) * 100);
  };

  const calculateScore = (): number => {
    if (!currentLevel) return 0;
    // Base score: 100
    // Time bonus factor: 0.5–1.0 based on how much time is remaining
    const timeRatio = timeLeft / currentLevel.timeLimit;          // 0–1
    const timeFactor = 0.5 + timeRatio * 0.5;                     // 0.5–1.0
    // Hint penalty: -15 points per hint
    const hintPenalty = hintsUsed * 15;
    const raw = Math.round(100 * timeFactor) - hintPenalty;
    return Math.max(0, raw);
  };

  const getStars = (): number => {
    if (!currentLevel) return 0;
    const timeRemaining = timeLeft / currentLevel.timeLimit;
    const hints = hintsUsed;
    // 3 stars: no hints AND time remaining > 50%
    if (hints === 0 && timeRemaining > 0.5) return 3;
    // 2 stars: time remaining < 50% OR exactly 1 hint
    if (timeRemaining <= 0.5 || hints === 1) return 2;
    // 1 star: more than 1 hint or multiple attempts
    return 1;
  };

  const handleCheckAnswer = () => {
    if (calculateMatchPercentage() === 100) {
      const finalScore = calculateScore();
      const stars = getStars();
      setScore(finalScore);
      setTimeout(() => {
        setShowWinModal(true);
        if (!testMode) {
          setLevels(prev => prev.map((level, i, arr) => {
            if (level.id === currentLevel?.id) return { ...level, stars, isLocked: false };
            if (i > 0 && arr[i - 1].id === currentLevel?.id) return { ...level, isLocked: false };
            return level;
          }));
          // Update player stats and level progress (only first completion)
          const timeUsed = currentLevel ? currentLevel.timeLimit - timeLeft : 0;
          const completedLevelId = currentLevel?.id;
          const nextLevelIdx = levels.findIndex(l => l.id === completedLevelId);
          const nextLevelId = nextLevelIdx >= 0 && nextLevelIdx < levels.length - 1 ? levels[nextLevelIdx + 1].id : null;
          setPlayers(prev => prev.map(p => {
            if (p.username === currentUser?.username) {
              const newProgress = { ...p.levelProgress };
              const alreadyCompleted = newProgress[completedLevelId || '']?.stars !== undefined;
              if (completedLevelId) {
                newProgress[completedLevelId] = { stars, unlocked: true, timeUsed };
              }
              if (nextLevelId) {
                newProgress[nextLevelId] = { ...(newProgress[nextLevelId] || {}), unlocked: true };
              }
              // First completion: add all stats
              if (!alreadyCompleted) {
                return {
                  ...p,
                  totalScore: p.totalScore + finalScore,
                  levelsPlayed: p.levelsPlayed + 1,
                  stars: p.stars + stars,
                  totalTime: p.totalTime + timeUsed,
                  levelProgress: newProgress,
                };
              }
              // Replay: update totalTime only if faster than previous best
              const oldTime = p.levelProgress[completedLevelId || '']?.timeUsed || 0;
              if (timeUsed < oldTime && oldTime > 0) {
                return {
                  ...p,
                  totalTime: p.totalTime - oldTime + timeUsed,
                  levelProgress: newProgress,
                };
              }
              // Replay: no time improvement, just update progress
              return { ...p, levelProgress: newProgress };
            }
            return p;
          }));
          // Sync progress to backend API
          if (currentUser && completedLevelId) {
            api.updateProgress(currentUser.username, {
              levelId: completedLevelId,
              stars, timeUsed, score: finalScore, hintsUsed,
              unlockNextLevelId: nextLevelId || undefined,
            }).catch(err => console.error('[API] Failed to sync progress:', err));
          }
        }
      }, 500);
    } else {
      // Wrong answer: reduce 1 life
      const newLives = globalLives - 1;
      setGlobalLives(Math.max(0, newLives));
      // Sync lives to backend API
      if (!testMode && currentUser) {
        api.updateLives(currentUser.username, Math.max(0, newLives)).catch(() => {});
      }
      if (newLives <= 0) {
        // Lives exhausted: auto-exit game and start revive countdown
        setShowValidationModal(false);
        setShowWinModal(false);
        setCurrentLevel(null);
        if (!testMode) setScreen('player-gallery');
        // Auto-start countdown: 1 life restored every 5 minutes
        setTimeout(() => startReviveCountdown(), 300);
      } else {
        setShowValidationModal(true);
      }
    }
  };

  // Apply a player's saved level progress to the levels state
  const applyPlayerProgress = (progress: Record<string, LevelProgress>) => {
    setLevels(prev => prev.map(level => {
      const saved = progress[level.id];
      if (saved) {
        return { ...level, stars: saved.stars, isLocked: !saved.unlocked };
      }
      // Default: first built-in level unlocked, rest locked
      const builtInLevels = ALL_DASAR_LEVELS;
      const isFirstLevel = level.id === builtInLevels[0]?.id;
      return { ...level, stars: undefined, isLocked: !isFirstLevel && !level.isUserCreated };
    }));
  };

  // Reset levels to fresh default state
  const resetLevelsToDefault = () => {
    setLevels(prev => prev.map(level => {
      const builtInIdx = ALL_DASAR_LEVELS.findIndex(b => b.id === level.id);
      return {
        ...level,
        stars: undefined,
        isLocked: builtInIdx > 0,
      };
    }));
  };

  const actuallyStartLevel = (level: Level) => {
    setCurrentLevel(level);
    const initial: CSSProperties = Object.fromEntries(
      level.propertyConfigs.map(p => [p.name, p.initialValue])
    );
    setPlayerValues(initial);
    setTimeLeft(level.timeLimit);
    setScore(100);
    setHintsUsed(0);
    setHintRevealed([]);
    setScreen('gameplay');
  };

  const startLevel = (level: Level) => {
    if (level.isLocked) return;
    if (globalLives <= 0 && !testMode) { setShowReviveModal(true); return; }
    // First navigate to gameplay
    actuallyStartLevel(level);
    // Then show learning popup on top of gameplay for dasar/tantangan levels
    if (level.levelType === 'dasar' || level.levelType === 'tantangan') {
      setLearningLevel(level);
      setIsInitialPopup(true);
      setShowLearningPopup(true);
    }
  };

  const generateMathQuestion = (difficulty: number) => {
    let question = '', answer = 0;
    if (difficulty === 1) {
      const a = Math.floor(Math.random() * 8) + 2, b = Math.floor(Math.random() * 8) + 2;
      question = `${a} × ${b} = ?`; answer = a * b;
    } else if (difficulty === 2) {
      if (Math.random() > 0.5) {
        const n = Math.floor(Math.random() * 10) + 5;
        question = `${n}² = ?`; answer = n * n;
      } else {
        const a = Math.floor(Math.random() * 10) + 10, b = Math.floor(Math.random() * 10) + 10;
        question = `${a} × ${b} = ?`; answer = a * b;
      }
    } else {
      const n = Math.floor(Math.random() * 10) + 10;
      question = `${n}² = ?`; answer = n * n;
    }
    setMathQuestion({ question, answer });
  };

  const handleHintRequest = () => {
    generateMathQuestion(hintsUsed + 1);
    setMathInput('');
    setShowHintModal(true);
  };

  const handleMathSubmit = () => {
    if (parseInt(mathInput) !== mathQuestion.answer) {
      setShowMathErrorModal(true);
      return;
    }
    const configs = currentLevel!.propertyConfigs;
    // Find a property not yet revealed
    const unrevealed = configs.filter(c => !hintRevealed.some(h => h.property === c.name));
    const configToReveal = unrevealed.length > 0
      ? unrevealed[Math.floor(Math.random() * unrevealed.length)]
      : configs[Math.floor(Math.random() * configs.length)];

    const def = PREDEFINED_PROPERTIES[configToReveal.name];
    const hint = `${configToReveal.name}: ${configToReveal.targetValue}${def ? ` (${getDisplayValue(configToReveal.name, configToReveal.targetValue)})` : ''}`;

    setHintRevealed(prev => [...prev, { property: configToReveal.name, hint }]);
    setHintsUsed(h => h + 1);
    setShowHintModal(false);
  };

  const handleExitLevel   = () => setShowExitConfirmModal(true);
  const confirmExitLevel  = () => {
    setShowExitConfirmModal(false);
    setCurrentLevel(null);
    if (testMode) {
      // Test mode: go back to creator without losing lives
      setTestMode(false);
      setScreen('creator');
    } else {
      const lives = globalLives - 1;
      setGlobalLives(lives);
      setScreen('player-gallery');
      if (lives <= 0) setTimeout(() => startReviveCountdown(), 300);
    }
  };

  const startReviveCountdown = () => {
    // Don't start countdown if lives are already full
    if (globalLives >= 3) return;
    // Restore 1 life every 5 minutes (not all at once)
    const newQueue = reviveLivesQueue + 1;
    setReviveLivesQueue(newQueue);
    if (reviveCountdown <= 0) {
      const endTime = Date.now() + 300_000;
      localStorage.setItem('nms_revive_end', endTime.toString());
      localStorage.setItem('nms_revive_queue', newQueue.toString());
      setReviveCountdown(300); // 5 min per life
    } else {
      // Already counting — just update queue in storage
      localStorage.setItem('nms_revive_queue', newQueue.toString());
    }
  };

  const handleLivesClick = () => {
    if (globalLives > 0) {
      setShowLivesClickModal(true);
    }
    // If lives are 0, countdown is already running or will start automatically
  };

  const handleSaveLevel = () => {
    if (!creatorTitle || creatorProperties.length === 0) {
      setShowCreatorErrorModal(true);
      return;
    }
    const isDev = currentUser?.role === 'developer';
    // Auto-number tantangan levels
    const existingTantangan = levels.filter(l => l.levelType === 'tantangan');
    const maxTantanganNum = existingTantangan.reduce((max, l) => {
      const num = parseInt(l.id.replace('t-', ''));
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    const nextTantanganNum = maxTantanganNum + 1;
    const levelId = isDev ? `t-${nextTantanganNum}` : `user-${Date.now()}`;
    const newLevel: Level = {
      id: levelId,
      title: creatorTitle,
      difficulty: creatorDifficulty,
      levelType: isDev ? 'tantangan' : 'custom',
      category: undefined,
      description: creatorDescription || (isDev ? 'Level tantangan baru' : 'Level buatan pemain'),
      htmlStructure: creatorHtml,
      propertyConfigs: creatorProperties,
      timeLimit: creatorTimeLimit,
      isUserCreated: !isDev,
      createdBy: isDev ? undefined : currentUser?.username,
    };
    setLevels(prev => [...prev, newLevel]);
    setShowSaveLevelModal(true);
    // Sync level creation to backend API
    api.createLevel({
      id: levelId,
      title: creatorTitle,
      description: creatorDescription || (isDev ? 'Level tantangan baru' : 'Level buatan pemain'),
      levelType: isDev ? 'tantangan' : 'custom',
      difficulty: creatorDifficulty,
      htmlStructure: creatorHtml,
      timeLimit: creatorTimeLimit,
      propertyConfigs: creatorProperties,
    }).catch(err => console.error('[API] Failed to create level:', err));
  };

  const handleLogout = async () => {
    // Sync lives to backend before logging out
    if (currentUser?.role === 'player') {
      try {
        await api.updateLives(currentUser.username, globalLives);
      } catch {}
    }
    api.logout();
    setCurrentUser(null);
    setLoginUsername('');
    setLoginPassword('');
    setLoginRole(null);
    setLoginError('');
    setRegName('');
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');
    setRegError('');
    setRegSuccess('');
    setDevTab('overview');
    resetLevelsToDefault();
    setScreen('splash');
  };

  const handleGoHome = () => {
    // Go to splash screen WITHOUT logging out — session/token stays active
    setScreen('splash');
  };

  const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // fallback kalau format tak terduga
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
  };

  const censorEmail = (email: string): string => {
    if (!email) return '-';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    const shown = local.substring(0, 1);
    const masked = '*'.repeat(Math.max(local.length - 1, 3));
    return `${shown}${masked}@${domain}`;
  };

  const completedLevels = levels.filter(l => l.stars !== undefined).length;

  const handleLogin = async () => {
    if (!loginUsername.trim()) {
      setLoginError('Masukkan username terlebih dahulu!');
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError('Masukkan password terlebih dahulu!');
      return;
    }
    setLoading(true);
    setLoginError('');
    try {
      const res = await api.login(loginUsername.trim(), loginPassword);
      setCurrentUser({ username: res.user.username, role: res.user.role as 'player' | 'developer' });
      setGlobalLives(res.user.lives);
      applyPlayerProgress(res.user.levelProgress);
      setScreen(res.user.role === 'developer' ? 'developer' : 'player-gallery');
    } catch (err: any) {
      // Fallback: if backend is unavailable, use local auth
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        const uname = loginUsername.trim();
        const pw = loginPassword;
        if (uname === 'developer1' && pw === 'dev123') {
          setCurrentUser({ username: 'developer1', role: 'developer' });
          setGlobalLives(3);
          setScreen('developer');
          setLoading(false);
          return;
        }
        const foundPlayer = players.find(
          p => p.username.toLowerCase() === uname.toLowerCase() && p.password === pw
        );
        if (foundPlayer) {
          setCurrentUser({ username: foundPlayer.username, role: 'player' });
          setGlobalLives(foundPlayer.lives);
          applyPlayerProgress(foundPlayer.levelProgress);
          setScreen('player-gallery');
          setLoading(false);
          return;
        }
        setLoginError('Username atau password salah!');
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError(err.message || 'Login gagal');
        setLoginUsername('');
        setLoginPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegError('');
    setRegSuccess('');
    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setRegError('Semua field harus diisi!');
      return;
    }
    if (!regEmail.includes('@')) {
      setRegError('Format email tidak valid!');
      return;
    }
    if (regPassword.length < 5) {
      setRegError('Password minimal 5 karakter!');
      return;
    }
    setLoading(true);
    try {
      await api.register(regName.trim(), regUsername.trim(), regEmail.trim(), regPassword);
      setRegSuccess(`Akun "${regUsername.trim()}" berhasil dibuat! Silakan login.`);
      setTimeout(() => {
        setLoginUsername(regUsername.trim());
        setLoginPassword('');
        setLoginRole('player');
        setRegName('');
        setRegUsername('');
        setRegEmail('');
        setRegPassword('');
        setRegSuccess('');
        setScreen('login');
      }, 1500);
    } catch (err: any) {
      // Fallback: if backend is unavailable, register locally
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        if (players.some(p => p.username.toLowerCase() === regUsername.trim().toLowerCase())) {
          setRegError('Username sudah terdaftar!');
        } else {
          const newPlayer: PlayerAccount = {
            name: regName.trim(), username: regUsername.trim(), email: regEmail.trim(),
            password: regPassword, totalScore: 0, levelsPlayed: 0, stars: 0, totalTime: 0,
            lives: 3, levelProgress: {}, createdAt: new Date().toISOString().split('T')[0],
          };
          setPlayers(prev => [...prev, newPlayer]);
          setRegSuccess(`Akun "${regUsername.trim()}" berhasil dibuat! Silakan login.`);
          setTimeout(() => {
            setLoginUsername(regUsername.trim()); setLoginPassword(''); setLoginRole('player');
            setRegName(''); setRegUsername(''); setRegEmail(''); setRegPassword(''); setRegSuccess('');
            setScreen('login');
          }, 1500);
        }
      } else {
        setRegError(err.message || 'Registrasi gagal');
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── SPLASH SCREEN ──────────────────────────────────────────────────────
  const renderSplashScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
      {[
        { top: '6%',  left: '4%',   size: '2rem',    delay: '0s',    opacity: 0.85 },
        { top: '12%', left: '18%',  size: '0.9rem',  delay: '0.4s',  opacity: 0.45 },
        { top: '4%',  left: '42%',  size: '1.3rem',  delay: '0.8s',  opacity: 0.6  },
        { top: '9%',  left: '68%',  size: '0.8rem',  delay: '0.2s',  opacity: 0.4  },
        { top: '5%',  left: '88%',  size: '1.7rem',  delay: '1s',    opacity: 0.8  },
        { top: '28%', left: '2%',   size: '1.1rem',  delay: '0.6s',  opacity: 0.55 },
        { top: '33%', left: '94%',  size: '1.4rem',  delay: '0.3s',  opacity: 0.65 },
        { top: '48%', left: '8%',   size: '0.75rem', delay: '1.2s',  opacity: 0.35 },
        { top: '52%', left: '87%',  size: '0.95rem', delay: '0.7s',  opacity: 0.5  },
        { top: '62%', left: '15%',  size: '1.5rem',  delay: '0.5s',  opacity: 0.75 },
        { top: '68%', left: '78%',  size: '1rem',    delay: '1.4s',  opacity: 0.45 },
        { top: '78%', left: '4%',   size: '0.9rem',  delay: '0.9s',  opacity: 0.4  },
        { top: '82%', left: '38%',  size: '1.2rem',  delay: '0.1s',  opacity: 0.55 },
        { top: '86%', left: '58%',  size: '0.75rem', delay: '1.1s',  opacity: 0.35 },
        { top: '91%', left: '91%',  size: '1.4rem',  delay: '0.6s',  opacity: 0.65 },
      ].map((s, i) => (
        <div key={i} className="absolute animate-bounce pointer-events-none select-none"
          style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: s.delay, opacity: s.opacity }}>
          ⭐
        </div>
      ))}

      <div className="flex flex-col items-center text-center z-10">
        <p className="text-xs tracking-widest mb-4" style={{ color: '#6C5CE7', fontWeight: 700 }}>
          ✦ GAME EDUKASI CSS ✦
        </p>
        <h1 className="uppercase leading-none"
          style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(5rem, 12vw, 10rem)', color: '#FFFFFF', letterSpacing: '6px' }}>
          NOT MY
        </h1>
        <h1 className="uppercase leading-none mb-6"
          style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(5rem, 12vw, 10rem)', color: '#FFD93D', letterSpacing: '6px', textShadow: '0 0 80px rgba(255,217,61,0.45)' }}>
          STYLE
        </h1>
        <p className="mb-10" style={{ color: '#9CA3AF', maxWidth: '600px', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Belajar UI/UX dan CSS melalui tantangan visual interaktif yang seru
        </p>
        <button
          onClick={() => {
            // If session is still active, go directly to the right screen
            if (api.isLoggedIn()) {
              const savedUser = api.getCurrentUser();
              if (savedUser) {
                if (!currentUser) {
                  setCurrentUser({ username: savedUser.username, role: savedUser.role as 'player' | 'developer' });
                  setGlobalLives(savedUser.lives ?? 3);
                }
                setScreen(savedUser.role === 'developer' ? 'developer' : 'player-gallery');
                return;
              }
            }
            setLoginError(''); setLoginRole('player'); setLoginUsername(''); setLoginPassword(''); setScreen('login');
          }}
          className="group relative overflow-hidden rounded-2xl px-20 py-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #FFD93D, #F59E0B)', boxShadow: '0 8px 40px rgba(255,217,61,0.35)' }}>
          <div className="flex items-center gap-3">
            <Play className="w-6 h-6" style={{ color: '#0B0B16' }} />
            <span className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#0B0B16', letterSpacing: '3px', fontWeight: 700 }}>
              PLAY GAME
            </span>
          </div>
        </button>
      </div>

      <p className="absolute bottom-6" style={{ color: '#374151', fontSize: '0.75rem' }}>
        © 2026 Not My Style | Muhamad Rizki Hidayat
      </p>
    </div>
  );

  // ─── LOGIN SCREEN ───────────────────────────────────────────────────────
  const renderLoginScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-y-auto py-8"
      style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
      {[
        { top: '8%',  left: '5%',   size: '1.5rem', delay: '0s',    opacity: 0.7 },
        { top: '15%', left: '90%',  size: '1rem',   delay: '0.5s',  opacity: 0.5 },
        { top: '75%', left: '8%',   size: '1.2rem', delay: '0.8s',  opacity: 0.6 },
        { top: '85%', left: '92%',  size: '1.4rem', delay: '0.3s',  opacity: 0.65 },
        { top: '40%', left: '3%',   size: '0.9rem', delay: '1s',    opacity: 0.4 },
      ].map((s, i) => (
        <div key={i} className="absolute animate-bounce pointer-events-none select-none"
          style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: s.delay, opacity: s.opacity }}>
          ⭐
        </div>
      ))}

      <button onClick={() => setScreen('splash')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-100"
        style={{ background: 'rgba(255,255,255,0.07)', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>
        ← Kembali
      </button>

      <h1 className="uppercase leading-none mb-2"
        style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(3rem, 7vw, 5rem)', color: '#FFFFFF', letterSpacing: '4px' }}>
        NOT MY <span style={{ color: '#FFD93D', textShadow: '0 0 60px rgba(255,217,61,0.4)' }}>STYLE</span>
      </h1>
      <p className="mb-8" style={{ color: '#6B7280', fontSize: '0.9rem' }}>Masuk untuk melanjutkan permainan</p>

      <div className="w-full rounded-2xl p-6"
        style={{ maxWidth: 'min(85%, 380px)', background: '#13131F', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>USERNAME</label>
        <input type="text" value={loginUsername}
          onChange={e => { setLoginUsername(e.target.value); setLoginError(''); }}
          placeholder="Masukkan username..."
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none transition-all duration-200"
          style={{ background: '#1E1E2E', border: loginError ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
        />

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>PASSWORD</label>
        <div className="relative mb-4">
          <input type={showPassword ? 'text' : 'password'} value={loginPassword}
            onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Masukkan password..."
            className="w-full rounded-xl px-4 py-3 pr-12 outline-none transition-all duration-200"
            style={{ background: '#1E1E2E', border: loginError ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:opacity-80"
            style={{ color: '#6B7280' }}>
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {loginError && (
          <div className="mb-4 px-4 py-2.5 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)' }}>
            <span style={{ color: '#FF6B6B', fontSize: '0.8rem' }}>⚠️</span>
            <span style={{ color: '#FF6B6B', fontSize: '0.8rem', fontWeight: 600 }}>{loginError}</span>
          </div>
        )}

        <button onClick={handleLogin}
          className="w-full rounded-xl py-3 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] mb-3"
          style={{
            background: 'linear-gradient(135deg, #FFD93D, #F59E0B)',
            color: '#0B0B16',
            fontWeight: 700, fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em',
            boxShadow: '0 4px 20px rgba(255,217,61,0.4)',
          }}>
          MASUK →
        </button>

        <p className="text-center" style={{ color: '#6B7280', fontSize: '0.85rem' }}>
          Belum punya akun?{' '}
          <button onClick={() => { setLoginError(''); setRegError(''); setRegSuccess(''); setScreen('register'); }}
            style={{ color: '#FFD93D', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
            Daftar Sekarang
          </button>
        </p>
      </div>

      <p className="mt-6" style={{ color: '#374151', fontSize: '0.75rem' }}>
        © 2026 Not My Style | Muhamad Rizki Hidayat
      </p>
    </div>
  );

  // ─── REGISTER SCREEN ────────────────────────────────────────────────────
  const renderRegisterScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-y-auto py-8"
      style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
      {[
        { top: '8%',  left: '5%',   size: '1.5rem', delay: '0s',    opacity: 0.7 },
        { top: '15%', left: '90%',  size: '1rem',   delay: '0.5s',  opacity: 0.5 },
        { top: '75%', left: '8%',   size: '1.2rem', delay: '0.8s',  opacity: 0.6 },
        { top: '85%', left: '92%',  size: '1.4rem', delay: '0.3s',  opacity: 0.65 },
      ].map((s, i) => (
        <div key={i} className="absolute animate-bounce pointer-events-none select-none"
          style={{ top: s.top, left: s.left, fontSize: s.size, animationDelay: s.delay, opacity: s.opacity }}>
          ⭐
        </div>
      ))}

      <button onClick={() => setScreen('login')}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-100"
        style={{ background: 'rgba(255,255,255,0.07)', color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, opacity: 0.7 }}>
        ← Kembali
      </button>

      <h1 className="uppercase leading-none mb-2"
        style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#FFFFFF', letterSpacing: '4px' }}>
        DAFTAR <span style={{ color: '#FFD93D', textShadow: '0 0 60px rgba(255,217,61,0.4)' }}>AKUN BARU</span>
      </h1>
      <p className="mb-6" style={{ color: '#6B7280', fontSize: '0.9rem' }}>Buat akun player untuk mulai bermain</p>

      <div className="w-full rounded-2xl p-6"
        style={{ maxWidth: 'min(85%, 380px)', background: '#13131F', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>NAMA</label>
        <input type="text" value={regName}
          onChange={e => { setRegName(e.target.value); setRegError(''); }}
          placeholder="Nama lengkap..."
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none transition-all duration-200"
          style={{ background: '#1E1E2E', border: regError && !regName ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
        />

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>USERNAME</label>
        <input type="text" value={regUsername}
          onChange={e => { setRegUsername(e.target.value); setRegError(''); }}
          placeholder="Pilih username unik..."
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none transition-all duration-200"
          style={{ background: '#1E1E2E', border: regError && !regUsername ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
        />

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>EMAIL</label>
        <input type="email" value={regEmail}
          onChange={e => { setRegEmail(e.target.value); setRegError(''); }}
          placeholder="email@contoh.com"
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none transition-all duration-200"
          style={{ background: '#1E1E2E', border: regError && !regEmail ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
        />

        <label className="block mb-2" style={{ color: '#9CA3AF', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>PASSWORD</label>
        <input type="password" value={regPassword}
          onChange={e => { setRegPassword(e.target.value); setRegError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
          placeholder="Minimal 5 karakter..."
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none transition-all duration-200"
          style={{ background: '#1E1E2E', border: regError && !regPassword ? '1.5px solid #FF6B6B' : '1.5px solid rgba(255,255,255,0.1)', color: '#FFFFFF', fontSize: '0.95rem', fontFamily: "'Space Grotesk', sans-serif" }}
        />

        {regError && (
          <div className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)' }}>
            <span style={{ color: '#FF6B6B', fontSize: '0.8rem' }}>⚠️</span>
            <span style={{ color: '#FF6B6B', fontSize: '0.8rem', fontWeight: 600 }}>{regError}</span>
          </div>
        )}

        {regSuccess && (
          <div className="mb-4 px-4 py-2 rounded-lg flex items-center gap-2"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
            <span style={{ color: '#4ADE80', fontSize: '0.8rem' }}>✅</span>
            <span style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 600 }}>{regSuccess}</span>
          </div>
        )}

        <button onClick={handleRegister}
          className="w-full rounded-xl py-3 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] mb-3"
          style={{
            background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
            color: '#052e16', fontWeight: 700, fontSize: '1rem', fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.05em', boxShadow: '0 4px 20px rgba(74,222,128,0.4)',
          }}>
          DAFTAR →
        </button>

        <p className="text-center" style={{ color: '#6B7280', fontSize: '0.85rem' }}>
          Sudah punya akun?{' '}
          <button onClick={() => { setRegError(''); setRegSuccess(''); setScreen('login'); }}
            style={{ color: '#FFD93D', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );

  // ─── DEVELOPER DASHBOARD ────────────────────────────────────────────────
  const renderDeveloperScreen = () => {
    const totalPlayers = devLeaderboard.length || devPlayers.length || players.length;
    const totalLevelsPlayed = devLeaderboard.reduce((a, p) => a + p.levelsPlayed, 0);
    const totalScore = devLeaderboard.reduce((a, p) => a + p.totalScore, 0);
    const customLevels = levels.filter(l => l.isUserCreated);

    return (
      <div className="min-h-screen" style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
        {/* Header */}
        <div style={{ background: '#1E1E2E', borderBottom: '1px solid #2D2D3A' }}>
          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.6rem', color: '#FFD93D', letterSpacing: '2px' }}>NOT MY STYLE</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(108,92,231,0.15)', border: '1px solid rgba(108,92,231,0.3)' }}>
                <span style={{ fontSize: '0.8rem' }}>💻</span>
                <span style={{ color: '#A78BFA', fontSize: '0.8rem', fontWeight: 600 }}>Muhamad Rizki Hidayat</span>
                <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>DEV</span>
              </div>
              <button onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                <Home className="w-4 h-4" />
                Home
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#FF6B6B22', color: '#FF6B6B', fontWeight: 600, border: '1px solid #FF6B6B44' }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Welcome banner */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
          <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(167,139,250,0.1))', border: '1px solid rgba(108,92,231,0.3)' }}>
            <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '2px', lineHeight: 1.1 }}>
              Selamat Datang, <span style={{ color: '#FFD93D' }}>Muhamad Rizki Hidayat</span>
            </h1>
            <p style={{ color: '#A78BFA', fontSize: '0.9rem', marginTop: '4px' }}>Developer — Pembuat & Pengelolaan Game</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-8 mb-6">
          <div className="flex gap-2">
            {[
              { key: 'overview' as const, label: '📊 Overview', color: '#FFD93D' },
              { key: 'players' as const, label: '👥 Players', color: '#4ADE80' },
              { key: 'levels' as const, label: '🎮 Levels', color: '#6C5CE7' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setDevTab(tab.key)}
                className="px-5 py-2.5 rounded-xl transition-all duration-200"
                style={{
                  background: devTab === tab.key ? tab.color : '#1E1E2E',
                  color: devTab === tab.key ? '#0B0B16' : '#9CA3AF',
                  fontWeight: 700, fontSize: '0.85rem',
                  border: devTab === tab.key ? `2px solid ${tab.color}` : '2px solid rgba(255,255,255,0.1)',
                }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 pb-10">
          {/* OVERVIEW TAB */}
          {devTab === 'overview' && (
            <div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl p-5 text-center" style={{ background: '#1E1E2E' }}>
                  <div className="text-3xl mb-2">👥</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.2rem', color: '#4ADE80' }}>{totalPlayers}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600 }}>Total Player</div>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: '#1E1E2E' }}>
                  <div className="text-3xl mb-2">🎮</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.2rem', color: '#FFD93D' }}>{totalLevelsPlayed}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600 }}>Level Dimainkan</div>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: '#1E1E2E' }}>
                  <div className="text-3xl mb-2">🏆</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.2rem', color: '#6C5CE7' }}>{totalScore}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600 }}>Total Skor</div>
                </div>
                <div className="rounded-2xl p-5 text-center" style={{ background: '#1E1E2E' }}>
                  <div className="text-3xl mb-2">📝</div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.2rem', color: '#FB923C' }}>{customLevels.length}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600 }}>Level Custom</div>
                </div>
              </div>

              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#FFFFFF', letterSpacing: '2px', marginBottom: '16px' }}>
                RANKING <span style={{ color: '#FFD93D' }}>PLAYER</span>
              </h2>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#1E1E2E' }}>
                {devLeaderboardLoading ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl mb-3 animate-bounce">⏳</div>
                    <p style={{ color: '#6B7280' }}>Memuat data leaderboard...</p>
                  </div>
                ) : devLeaderboard.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl mb-3">📭</div>
                    <p style={{ color: '#6B7280' }}>Belum ada data pemain.</p>
                  </div>
                ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2D2D3A' }}>
                      <th className="text-center px-4 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>#</th>
                      <th className="text-left px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>PLAYER</th>
                      <th className="text-center px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>SKOR</th>
                      <th className="text-center px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>LEVEL</th>
                      <th className="text-center px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>BINTANG</th>
                      <th className="text-center px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>WAKTU</th>
                      <th className="text-center px-6 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>BERGABUNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devLeaderboard.map((p, idx) => {
                      const playerDetail = devPlayers.find(dp => dp.username === p.username);
                      return (
                        <tr key={p.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td className="px-4 py-3 text-center" style={{ fontSize: '1.1rem' }}>
                            {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (
                              <span style={{ color: '#6B7280', fontWeight: 700 }}>{idx + 1}</span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{p.name || p.username}</div>
                            <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>@{p.username}</div>
                          </td>
                          <td className="px-6 py-3 text-center" style={{ color: '#FFD93D', fontWeight: 800, fontSize: '1.05rem' }}>{p.totalScore}</td>
                          <td className="px-6 py-3 text-center" style={{ color: '#4ADE80', fontWeight: 700 }}>{p.levelsPlayed}</td>
                          <td className="px-6 py-3 text-center" style={{ color: '#FFD93D', fontWeight: 700 }}>⭐ {p.stars}</td>
                          <td className="px-6 py-3 text-center" style={{ color: '#A78BFA', fontWeight: 600, fontFamily: 'monospace' }}>
                            {p.totalTime > 0 ? `${p.totalTime}s` : '-'}
                          </td>
                          <td className="px-6 py-3 text-center" style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>
                            {playerDetail?.createdAt ? formatDate(playerDetail.createdAt) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                )}
              </div>
            </div>
          )}

          {/* PLAYERS TAB */}
          {devTab === 'players' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#FFFFFF', letterSpacing: '2px' }}>
                  DATA <span style={{ color: '#4ADE80' }}>PLAYER</span>
                </h2>
                <span className="px-3 py-1 rounded-full" style={{ background: '#1E1E2E', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 700 }}>
                  {devPlayers.length} akun
                </span>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: '#1E1E2E' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2D2D3A' }}>
                      <th className="text-left px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700 }}>NAMA</th>
                      <th className="text-left px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700 }}>USERNAME</th>
                      <th className="text-left px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700 }}>EMAIL</th>
                      <th className="text-left px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700 }}>PASSWORD</th>
                      <th className="text-center px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700 }}>AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devPlayers.map(p => (
                      <tr key={p.username || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td className="px-5 py-3" style={{ color: '#FFFFFF', fontWeight: 600 }}>{p.name || '-'}</td>
                        <td className="px-5 py-3" style={{ color: '#9CA3AF' }}>@{p.username || '-'}</td>
                        <td className="px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>{censorEmail(p.email || '')}</td>
                        <td className="px-5 py-3" style={{ color: '#6B7280', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                          {p.password ? '••••••••' : '-'}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewPlayerUsername(p.username)}
                              className="px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: 'rgba(21,145,220,0.15)', color: '#1591DC', fontWeight: 600, fontSize: '0.75rem', border: '1px solid rgba(21,145,220,0.2)' }}>
                              👁 Lihat
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(p.username)}
                              className="px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                              style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.75rem', border: '1px solid rgba(255,107,107,0.2)' }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* View Player Modal */}
              {viewPlayerUsername && (() => {
                const vp = devPlayers.find(p => p.username === viewPlayerUsername);
                if (!vp) return null;
                const dasarLevels = levels.filter(l => l.levelType === 'dasar');
                const playerStars = dasarLevels.reduce((a, l) => a + (l.stars || 0), 0);
                return (
                  <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
                    <div className="rounded-3xl p-8 max-w-lg w-full" style={{ background: '#1E1E2E', border: '2px solid #1591DC' }}>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#1591DC', letterSpacing: '2px' }}>DETAIL PLAYER</h2>
                        <button onClick={() => setViewPlayerUsername(null)}
                          className="px-4 py-2 rounded-xl hover:opacity-80" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>✕</button>
                      </div>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                          <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>Nama</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{vp.name}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                          <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>Username</span>
                          <span style={{ color: '#FFD93D', fontWeight: 700 }}>@{vp.username}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                          <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>Email</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>{vp.email}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                          <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>Password</span>
                          <span style={{ color: '#FF6B6B', fontWeight: 700, fontFamily: 'monospace' }}>{vp.password}</span>
                        </div>
                        <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                          <span style={{ color: '#9CA3AF', fontWeight: 600, fontSize: '0.85rem' }}>Terdaftar Sejak</span>
                          <span style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.9rem' }}>{formatDate(vp.createdAt)}</span>
                        </div>
                      </div>
                      <button onClick={() => setViewPlayerUsername(null)}
                        className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                        style={{ background: '#1591DC', color: '#fff', fontWeight: 700 }}>Tutup</button>
                    </div>
                  </div>
                );
              })()}

              {/* Delete confirmation modal */}
              {showDeleteConfirm && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
                  <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FF6B6B' }}>
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#FF6B6B', letterSpacing: '3px' }}>HAPUS AKUN</h2>
                    <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Yakin ingin menghapus akun <strong style={{ color: '#FFFFFF' }}>"{showDeleteConfirm}"</strong>? Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowDeleteConfirm(null)}
                        className="flex-1 px-6 py-3 rounded-xl hover:opacity-80"
                        style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 700 }}>BATAL</button>
                      <button onClick={() => {
                        api.deletePlayer(showDeleteConfirm!)
                          .then(() => api.getPlayers().then(setDevPlayers))
                          .catch(err => console.error('[API] Failed to delete player:', err));
                        setShowDeleteConfirm(null);
                      }}
                        className="flex-1 px-6 py-3 rounded-xl hover:opacity-80"
                        style={{ background: '#FF6B6B', color: '#fff', fontWeight: 700 }}>HAPUS</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LEVELS TAB */}
          {devTab === 'levels' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#FFFFFF', letterSpacing: '2px' }}>
                  KELOLA <span style={{ color: '#6C5CE7' }}>LEVEL</span>
                </h2>
                <button onClick={() => setScreen('creator')}
                  className="px-5 py-2.5 rounded-xl transition-all hover:opacity-80"
                  style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 4px 15px rgba(108,92,231,0.3)' }}>
                  + Buat Level Baru
                </button>
              </div>

              {/* Level Dasar */}
              <h3 className="mb-3" style={{ color: '#4ADE80', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>🟢 LEVEL DASAR</h3>
              <div className="grid gap-3 mb-8">
                {levels.filter(l => l.levelType === 'dasar').map(l => (
                  <div key={l.id} className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ background: '#1E1E2E', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ background: 'rgba(74,222,128,0.15)' }}>📝</div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontWeight: 700 }}>{l.title}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded text-xs" style={{
                            background: l.difficulty === 'Mudah' ? '#4ADE8033' : l.difficulty === 'Sedang' ? '#FFD93D33' : '#FF6B6B33',
                            color: l.difficulty === 'Mudah' ? '#4ADE80' : l.difficulty === 'Sedang' ? '#FFD93D' : '#FF6B6B',
                            fontWeight: 700,
                          }}>{l.difficulty}</span>
                          {l.category && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(96,165,250,0.2)', color: '#60A5FA', fontWeight: 600 }}>{l.category}</span>}
                          {l.concept && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(108,92,231,0.2)', color: '#A78BFA', fontWeight: 600 }}>{l.concept}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{l.propertyConfigs.length} properti</span>
                      <span style={{ color: '#6B7280', fontSize: '0.8rem' }}>{l.timeLimit}s</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Level Tantangan */}
              <h3 className="mb-3" style={{ color: '#FB923C', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>🏆 LEVEL TANTANGAN</h3>
              <div className="grid gap-3 mb-8">
                {levels.filter(l => l.levelType === 'tantangan').map(l => (
                  <div key={l.id} className="rounded-2xl p-5 flex items-center justify-between"
                    style={{ background: '#1E1E2E', border: '1px solid rgba(251,146,60,0.2)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ background: 'rgba(251,146,60,0.15)' }}>🏆</div>
                      <div>
                        <div style={{ color: '#FFFFFF', fontWeight: 700 }}>{l.title}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(251,146,60,0.2)', color: '#FB923C', fontWeight: 700 }}>Tantangan</span>
                          <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>{l.propertyConfigs.length} properti · {l.timeLimit}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Level Custom */}
              <h3 className="mb-3" style={{ color: '#1591DC', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.1em' }}>🛠️ LEVEL CUSTOM</h3>
              {customLevels.length === 0 ? (
                <div className="rounded-2xl p-8 text-center" style={{ background: '#1E1E2E' }}>
                  <div className="text-4xl mb-3">📭</div>
                  <p style={{ color: '#6B7280' }}>Belum ada level custom yang dibuat.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {customLevels.map(l => (
                    <div key={l.id} className="rounded-2xl p-5 flex items-center justify-between"
                      style={{ background: '#1E1E2E', border: '1px solid rgba(21,145,220,0.2)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                          style={{ background: 'rgba(21,145,220,0.15)' }}>🛠️</div>
                        <div>
                          <div style={{ color: '#FFFFFF', fontWeight: 700 }}>{l.title}</div>
                          <div className="flex gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-xs" style={{
                              background: l.difficulty === 'Mudah' ? '#4ADE8033' : l.difficulty === 'Sedang' ? '#FFD93D33' : '#FF6B6B33',
                              color: l.difficulty === 'Mudah' ? '#4ADE80' : l.difficulty === 'Sedang' ? '#FFD93D' : '#FF6B6B',
                              fontWeight: 700,
                            }}>{l.difficulty}</span>
                            {l.category && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(96,165,250,0.2)', color: '#60A5FA', fontWeight: 600 }}>{l.category}</span>}
                            {l.createdBy && <span className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(255,217,61,0.15)', color: '#FFD93D', fontWeight: 600 }}>by {l.createdBy}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setLevels(prev => prev.map(lv => lv.id === l.id ? { ...lv, isUserCreated: false } : lv));
                          }}
                          className="px-4 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(74,222,128,0.2)' }}>
                          ↑ Jadi Level Dasar
                        </button>
                        <button
                          onClick={() => setLevels(prev => prev.filter(lv => lv.id !== l.id))}
                          className="px-4 py-2 rounded-xl transition-all hover:opacity-80"
                          style={{ background: 'rgba(255,107,107,0.15)', color: '#FF6B6B', fontWeight: 600, fontSize: '0.8rem', border: '1px solid rgba(255,107,107,0.2)' }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Developer Dashboard Footer */}
        <div className="text-center py-6" style={{ borderTop: '1px solid #1E1E2E' }}>
          <p style={{ color: '#374151', fontSize: '0.75rem' }}>© 2026 Not My Style | Muhamad Rizki Hidayat</p>
        </div>
      </div>
    );
  };

  // ─── PLAYER GALLERY ─────────────────────────────────────────────────────
  const renderPlayerGallery = () => {
    const builtInLevels = levels.filter(l => !l.isUserCreated);
    const userLevels    = levels.filter(l => l.isUserCreated && (!l.createdBy || l.createdBy === currentUser?.username));
    return (
      <div className="min-h-screen" style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
        <div style={{ background: '#1E1E2E', borderBottom: '1px solid #2D2D3A' }}>
          <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.6rem', color: '#FFD93D', letterSpacing: '2px' }}>NOT MY STYLE</span>
            </div>
            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(255,217,61,0.1)', border: '1px solid rgba(255,217,61,0.2)' }}>
                  <span style={{ fontSize: '0.8rem' }}>👤</span>
                  <span style={{ color: '#FFD93D', fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.username}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#4ADE80', color: '#052e16', fontWeight: 700 }}>PLAYER</span>
                </div>
              )}
              <button onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:opacity-80"
                style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                <Home className="w-4 h-4" />
                Home
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors hover:opacity-80"
                style={{ background: '#FF6B6B22', color: '#FF6B6B', fontWeight: 600, border: '1px solid #FF6B6B44' }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 pt-8">
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <button onClick={handleLivesClick}
              className="flex flex-col items-center justify-center px-4 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{ background: '#1E1E2E', border: `1px solid ${globalLives === 0 ? '#FF6B6B88' : '#FF6B6B44'}` }}>
              <div className="flex items-center gap-2">
                <span className="text-lg">❤️</span>
                <span style={{ color: globalLives === 0 ? '#FF6B6B' : '#FFD93D', fontWeight: 700 }}>{globalLives}/3</span>
                <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Nyawa</span>
              </div>
              {reviveCountdown > 0 && (
                <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#FFD93D', fontWeight: 700, marginTop: '2px' }}>
                  ⏳ {Math.floor(reviveCountdown / 60)}:{(reviveCountdown % 60).toString().padStart(2, '0')}
                </div>
              )}
            </button>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#1E1E2E' }}>
              <span className="text-lg">🏆</span>
              <span style={{ color: '#FFD93D', fontWeight: 700 }}>{completedLevels}</span>
              <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Selesai</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: '#1E1E2E' }}>
              <span className="text-lg">⭐</span>
              <span style={{ color: '#FFD93D', fontWeight: 700 }}>{levels.reduce((a, l) => a + (l.stars || 0), 0)}</span>
              <span style={{ color: '#6B7280', fontSize: '0.75rem' }}>Bintang</span>
            </div>
            <button onClick={() => {
              setShowLeaderboardModal(true);
              setLeaderboardData([]);
              setLeaderboardLoading(true);
              api.getLeaderboard()
                .then(data => { setLeaderboardData(data); setLeaderboardLoading(false); })
                .catch(() => {
                  // Fallback: build leaderboard from local players state
                  const totalBuiltIn = levels.filter(l => !l.isUserCreated).length;
                  const localLb = players.map((p, idx) => ({
                    rank: idx + 1,
                    username: p.username,
                    name: p.name,
                    totalScore: p.totalScore,
                    levelsPlayed: p.levelsPlayed,
                    stars: p.stars,
                    totalTime: p.totalTime,
                  }));
                  localLb.sort((a, b) => {
                    const aAllDone = a.levelsPlayed >= totalBuiltIn ? 0 : 1;
                    const bAllDone = b.levelsPlayed >= totalBuiltIn ? 0 : 1;
                    if (aAllDone !== bAllDone) return aAllDone - bAllDone;
                    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
                    return a.totalTime - b.totalTime;
                  });
                  localLb.forEach((e, i) => e.rank = i + 1);
                  setLeaderboardData(localLb);
                  setLeaderboardLoading(false);
                });
            }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
              style={{ background: '#1E1E2E', border: '1px solid #FFD93D44' }}>
              <span className="text-lg">📊</span>
              <span style={{ color: '#FFD93D', fontWeight: 700 }}>Leaderboard</span>
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-8 pb-10">
          {(() => {
            const dasarLevels = levels.filter(l => l.levelType === 'dasar');
            const tantanganLevels = levels.filter(l => l.levelType === 'tantangan');
            const userLevels = levels.filter(l => l.isUserCreated && (!l.createdBy || l.createdBy === currentUser?.username));
            const mudahLevels = dasarLevels.filter(l => l.difficulty === 'Mudah');
            const sedangLevels = dasarLevels.filter(l => l.difficulty === 'Sedang');
            const mudahStars = mudahLevels.reduce((a, l) => a + (l.stars || 0), 0);
            const sedangStars = sedangLevels.reduce((a, l) => a + (l.stars || 0), 0);
            const semuaMudahSelesai = mudahLevels.length > 0 && mudahLevels.every(l => l.stars !== undefined);
            const semuaSedangSelesai = sedangLevels.length > 0 && sedangLevels.every(l => l.stars !== undefined);
            const semuaDasarSelesai = dasarLevels.every(l => l.stars !== undefined);
            const categoryMeta: Record<string, { icon: string; color: string; desc: string }> = {
              'Visual': { icon: '🎨', color: '#F472B6', desc: 'Background Color, Text Color, Border Radius, Opacity' },
              'Typography': { icon: '✍️', color: '#60A5FA', desc: 'Font Size, Font Weight, Text Align, Letter Spacing' },
              'Spacing': { icon: '📏', color: '#34D399', desc: 'Padding, Margin, Gap' },
              'Layout': { icon: '📐', color: '#A78BFA', desc: 'Display, Width, Height, Align Items, Justify Content' },
            };

            // Helper: check if a level is sequentially unlocked within its category
            const isLevelUnlocked = (level: Level, allLevelsInCat: Level[]): boolean => {
              const idx = allLevelsInCat.findIndex(l => l.id === level.id);
              if (idx <= 0) return true; // first level always unlocked
              return allLevelsInCat[idx - 1].stars !== undefined; // previous level completed
            };

            // ─── MAIN VIEW: Show 3 big section cards ───
            if (galleryView === 'main') {
              const difficulties = ['Mudah', 'Sedang', 'Sulit'] as const;
              const diffMeta = {
                'Mudah': { icon: '🟢', color: '#4ADE80', bg: 'rgba(74,222,128,0.08)', border: '#4ADE80' },
                'Sedang': { icon: '🟡', color: '#FFD93D', bg: 'rgba(255,217,61,0.08)', border: '#FFD93D' },
                'Sulit': { icon: '🔴', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: '#FF6B6B' },
              };
              return (
                <>
                  {/* LEVEL DASAR section */}
                  <div className="mb-10">
                    <h1 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF', letterSpacing: '3px' }}>
                      LEVEL <span style={{ color: '#4ADE80' }}>DASAR</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {difficulties.map(diff => {
                        const diffLevels = dasarLevels.filter(l => l.difficulty === diff);
                        const diffStars = diffLevels.reduce((a, l) => a + (l.stars || 0), 0);
                        const maxStars = diffLevels.length * 3;
                        const dm = diffMeta[diff];
                        return (
                          <button key={diff}
                            onClick={() => {
                              if (diff === 'Sedang' && (mudahStars < 32 || !semuaMudahSelesai)) { setShowDifficultyLockPopup('Sedang'); return; }
                              if (diff === 'Sulit' && (sedangStars < 32 || !semuaSedangSelesai)) { setShowDifficultyLockPopup('Sulit'); return; }
                              setGalleryView('dasar');
                              setSelectedDifficulty(diff);
                            }}
                            className="rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.03]"
                            style={{ background: dm.bg, border: `2px solid ${dm.border}` }}>
                            <div className="flex items-center gap-3 mb-4">
                              <span style={{ fontSize: '2rem' }}>{dm.icon}</span>
                              <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: dm.color, letterSpacing: '2px' }}>{diff}</h2>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>⭐ Bintang</span>
                                <span style={{ color: dm.color, fontWeight: 700 }}>{diffStars}/{maxStars}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>📝 Level</span>
                                <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{diffLevels.length}</span>
                              </div>
                              <div className="w-full rounded-full h-2 mt-2" style={{ background: '#2D2D3A' }}>
                                <div className="h-2 rounded-full transition-all" style={{ width: `${maxStars > 0 ? (diffStars / maxStars) * 100 : 0}%`, background: dm.color }} />
                              </div>
                            </div>
                            <div className="mt-4 text-sm" style={{ color: dm.color, fontWeight: 700 }}>Pilih →</div>
                            {diff === 'Mudah' && (
                              <p style={{ color: '#6B7280', fontSize: '0.7rem', marginTop: '8px' }}>✅ Terbuka untuk semua pemain</p>
                            )}
                            {diff === 'Sedang' && (
                              <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.2)' }}>
                                <p style={{ color: '#FFD93D', fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.4 }}>
                                  🔒 Syarat: Minimal <strong>32 ⭐</strong> dari Level Mudah + selesaikan <strong>semua 16 Level Mudah</strong>
                                </p>
                                <p style={{ color: '#9CA3AF', fontSize: '0.65rem', marginTop: '4px' }}>
                                  Progress: {mudahStars}/32 ⭐ · {mudahLevels.filter(l => l.stars !== undefined).length}/{mudahLevels.length} level selesai
                                </p>
                              </div>
                            )}
                            {diff === 'Sulit' && (
                              <div style={{ marginTop: '8px', padding: '6px 10px', borderRadius: '8px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
                                <p style={{ color: '#FF6B6B', fontSize: '0.68rem', fontWeight: 600, lineHeight: 1.4 }}>
                                  🔒 Syarat: Minimal <strong>32 ⭐</strong> dari Level Sedang + selesaikan <strong>semua 16 Level Sedang</strong>
                                </p>
                                <p style={{ color: '#9CA3AF', fontSize: '0.65rem', marginTop: '4px' }}>
                                  Progress: {sedangStars}/32 ⭐ · {sedangLevels.filter(l => l.stars !== undefined).length}/{sedangLevels.length} level selesai
                                </p>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* LEVEL TANTANGAN card */}
                  <div className="mb-10">
                    <h1 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '2px' }}>
                      LEVEL <span style={{ color: '#FB923C' }}>TANTANGAN</span>
                    </h1>
                    <button
                      onClick={() => {
                        if (!semuaDasarSelesai) {
                          setShowDifficultyLockPopup(null);
                          setShowTantanganIntro(true);
                          setTantanganIntroLevel(null);
                          return;
                        }
                        setGalleryView('tantangan');
                      }}
                      className="w-full rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: 'rgba(251,146,60,0.08)', border: '2px solid #FB923C' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span style={{ fontSize: '2rem' }}>🏆</span>
                        <div>
                          <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', color: '#FB923C', letterSpacing: '2px' }}>TANTANGAN</h2>
                          <p style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{tantanganLevels.length} Level · Gabungan semua kategori</p>
                        </div>
                      </div>
                      {!semuaDasarSelesai && <p style={{ color: '#FB923C', fontSize: '0.8rem' }}>🔒 Selesaikan seluruh 48 Level Dasar</p>}
                      <div className="mt-3 text-sm" style={{ color: '#FB923C', fontWeight: 700 }}>Pilih →</div>
                    </button>
                  </div>

                  {/* LEVEL CUSTOM card */}
                  <div className="mb-10">
                    <h1 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '2px' }}>
                      LEVEL <span style={{ color: '#1591DC' }}>CUSTOM</span>
                    </h1>
                    <button
                      onClick={() => setGalleryView('custom')}
                      className="w-full rounded-2xl p-6 text-left transition-all duration-300 hover:scale-[1.02]"
                      style={{ background: 'rgba(21,145,220,0.08)', border: '2px solid #1591DC' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span style={{ fontSize: '2rem' }}>🛠️</span>
                        <div>
                          <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', color: '#1591DC', letterSpacing: '2px' }}>CUSTOM</h2>
                          <p style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>{userLevels.length > 0 ? `${userLevels.length} Level tersedia` : 'Buat level pertamamu'}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-sm" style={{ color: '#1591DC', fontWeight: 700 }}>Pilih →</div>
                    </button>
                  </div>
                </>
              );
            }

            // ─── DASAR VIEW: Show categories + levels for selected difficulty ───
            if (galleryView === 'dasar' && selectedDifficulty) {
              const diffLevels = dasarLevels.filter(l => l.difficulty === selectedDifficulty);
              const diffStars = diffLevels.reduce((a, l) => a + (l.stars || 0), 0);
              const maxStars = diffLevels.length * 3;
              const diffColor = selectedDifficulty === 'Mudah' ? '#4ADE80' : selectedDifficulty === 'Sedang' ? '#FFD93D' : '#FF6B6B';
              const categories = ['Visual', 'Typography', 'Spacing', 'Layout'] as const;
              return (
                <div className="mb-10">
                  <button onClick={() => { setGalleryView('main'); setSelectedDifficulty(null); }}
                    className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl hover:opacity-80"
                    style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                    ← Kembali
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-sm" style={{ background: diffColor, color: selectedDifficulty === 'Sulit' ? '#fff' : '#0B0B16', fontWeight: 700 }}>{selectedDifficulty}</span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>⭐ {diffStars}/{maxStars} bintang</span>
                  </div>
                  {categories.map(cat => {
                    const catLevels = diffLevels.filter(l => l.category === cat);
                    if (catLevels.length === 0) return null;
                    const meta = categoryMeta[cat];
                    return (
                      <div key={cat} className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span style={{ fontSize: '1.3rem' }}>{meta.icon}</span>
                          <div>
                            <h3 style={{ color: meta.color, fontWeight: 700, fontSize: '1.1rem' }}>{cat}</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{meta.desc}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          {catLevels.map((level) => {
                            const unlocked = isLevelUnlocked(level, catLevels);
                            const isDisabled = !unlocked || globalLives === 0;
                            if (!unlocked) {
                              return (
                                <div key={level.id} className="rounded-2xl p-6 flex items-center justify-center"
                                  style={{ background: '#1E1E2E', border: '2px solid #2D2D3A', minHeight: '120px' }}>
                                  <Lock className="w-8 h-8" style={{ color: '#4B5563' }} />
                                </div>
                              );
                            }
                            return (
                              <button key={level.id} onClick={() => startLevel(level)} disabled={globalLives === 0}
                                className="relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105"
                                style={{ background: '#1E1E2E', border: `2px solid ${globalLives === 0 ? '#2D2D3A' : diffColor}`, opacity: globalLives === 0 ? 0.5 : 1, cursor: globalLives === 0 ? 'not-allowed' : 'pointer' }}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>{level.concept}</span>
                                  {level.stars !== undefined && (
                                    <div className="flex gap-0.5">
                                      {[...Array(3)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3" style={{ fill: i < level.stars! ? '#FFD93D' : '#2D2D3A', stroke: '#FFD93D', strokeWidth: 1 }} />
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <h3 className="uppercase mb-1" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.1rem', color: '#FFFFFF', letterSpacing: '1px', lineHeight: 1.1 }}>{level.title}</h3>
                                <p style={{ color: '#6B7280', fontSize: '0.7rem', lineHeight: 1.3 }}>{level.propertyConfigs.length} properti · {level.timeLimit}s</p>
                                {globalLives > 0 && <div className="mt-2 text-xs" style={{ color: diffColor, fontWeight: 700 }}>MAIN →</div>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            }

            // ─── TANTANGAN VIEW ───
            if (galleryView === 'tantangan') {
              return (
                <div className="mb-10">
                  <button onClick={() => setGalleryView('main')}
                    className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl hover:opacity-80"
                    style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                    ← Kembali
                  </button>
                  <h1 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '2px' }}>
                    LEVEL <span style={{ color: '#FB923C' }}>TANTANGAN</span>
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tantanganLevels.map((level, idx) => {
                      const unlocked = isLevelUnlocked(level, tantanganLevels);
                      const isDisabled = !unlocked || globalLives === 0;
                      if (!unlocked) {
                        return (
                          <div key={level.id} className="rounded-2xl p-6 flex items-center justify-center"
                            style={{ background: '#1E1E2E', border: '2px solid #2D2D3A', minHeight: '140px' }}>
                            <Lock className="w-8 h-8" style={{ color: '#4B5563' }} />
                          </div>
                        );
                      }
                      return (
                        <button key={level.id} onClick={() => startLevel(level)} disabled={globalLives === 0}
                          className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:scale-105"
                          style={{ background: '#1E1E2E', border: `2px solid ${globalLives === 0 ? '#2D2D3A' : '#FB923C'}`, opacity: globalLives === 0 ? 0.5 : 1, cursor: globalLives === 0 ? 'not-allowed' : 'pointer' }}>
                          <div className="flex justify-between items-center mb-3">
                            <span style={{ fontSize: '1.2rem' }}>🏆</span>
                            <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#FB923C', color: '#fff', fontWeight: 700 }}>#{idx + 1}</span>
                          </div>
                          <h3 className="uppercase mb-1" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.3rem', color: '#FFFFFF', letterSpacing: '1px' }}>{level.title}</h3>
                          <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{level.propertyConfigs.length} properti · {level.timeLimit}s</p>
                          {level.stars !== undefined && (
                            <div className="flex gap-0.5 mt-2">
                              {[...Array(3)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5" style={{ fill: i < level.stars! ? '#FFD93D' : '#2D2D3A', stroke: '#FFD93D', strokeWidth: 1 }} />
                              ))}
                            </div>
                          )}
                          {globalLives > 0 && <div className="mt-3 text-xs" style={{ color: '#FB923C', fontWeight: 700 }}>MAIN →</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // ─── CUSTOM VIEW ───
            if (galleryView === 'custom') {
              return (
                <div className="mb-10">
                  <button onClick={() => setGalleryView('main')}
                    className="flex items-center gap-2 mb-4 px-4 py-2 rounded-xl hover:opacity-80"
                    style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                    ← Kembali
                  </button>
                  <h1 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#FFFFFF', letterSpacing: '2px' }}>
                    LEVEL <span style={{ color: '#1591DC' }}>CUSTOM</span>
                  </h1>
                  {userLevels.length === 0 ? (
                    <div className="rounded-2xl p-12 text-center" style={{ background: '#1E1E2E', border: '2px dashed #2D2D3A' }}>
                      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛠️</div>
                      <h2 className="uppercase mb-3" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#FFFFFF', letterSpacing: '2px' }}>BELUM ADA LEVEL</h2>
                      <p style={{ color: '#6B7280', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 24px' }}>
                        Belum ada Level Custom yang tersedia. Buat level pertamamu sesuai keinginanmu, lalu simpan untuk mulai memainkannya.
                      </p>
                      <button onClick={() => setScreen('creator')}
                        className="px-8 py-3 rounded-xl transition-all hover:opacity-80"
                        style={{ background: '#1591DC', color: '#fff', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 15px rgba(21,145,220,0.3)' }}>
                        <Plus className="w-4 h-4 inline mr-2" />Buat Level
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userLevels.map(level => {
                        const isDisabled = globalLives === 0;
                        return (
                          <button key={level.id} onClick={() => startLevel(level)} disabled={isDisabled}
                            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 hover:scale-105"
                            style={{ background: '#1E1E2E', border: '2px solid #1591DC', opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
                            <div className="flex justify-between items-center mb-3">
                              <span style={{ fontSize: '1.2rem' }}>🛠️</span>
                              <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#1591DC', color: '#fff', fontWeight: 700 }}>USER</span>
                            </div>
                            <h3 className="uppercase mb-1" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.3rem', color: '#FFFFFF', letterSpacing: '1px' }}>{level.title}</h3>
                            <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{level.propertyConfigs.length} properti · {level.timeLimit}s</p>
                            {!isDisabled && <div className="mt-3 text-xs" style={{ color: '#1591DC', fontWeight: 700 }}>MAIN →</div>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })()}
        </div>

        {/* Footer */}
        <div className="max-w-6xl mx-auto px-8 pb-8 text-center">
          <p style={{ color: '#374151', fontSize: '0.75rem' }}>© 2026 Not My Style | Muhamad Rizki Hidayat</p>
        </div>

        {/* Leaderboard Modal */}
        {showLeaderboardModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
            <div className="rounded-3xl p-8 max-w-3xl w-full" style={{ background: '#1E1E2E', border: '2px solid #FFD93D', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#FFD93D', letterSpacing: '2px' }}>
                  🏆 LEADERBOARD PLAYER
                </h2>
                <button onClick={() => { setShowLeaderboardModal(false); setLeaderboardData([]); }}
                  className="px-4 py-2 rounded-xl hover:opacity-80" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>✕ Tutup</button>
              </div>

              {leaderboardLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-4xl mb-4 animate-bounce">⏳</div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Memuat data leaderboard...</p>
                </div>
              ) : leaderboardData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-4xl mb-4">📭</div>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Belum ada data pemain.</p>
                </div>
              ) : (
                <div className="overflow-auto flex-1">
                  <div className="rounded-xl overflow-hidden" style={{ background: '#0B0B16' }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid #2D2D3A' }}>
                          <th className="text-center px-4 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>#</th>
                          <th className="text-left px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>PLAYER</th>
                          <th className="text-center px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>SKOR</th>
                          <th className="text-center px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>LEVEL</th>
                          <th className="text-center px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>BINTANG</th>
                          <th className="text-center px-5 py-3" style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700 }}>WAKTU</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((p, idx) => (
                          <tr key={p.username} style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: p.username === currentUser?.username ? 'rgba(255,217,61,0.07)' : 'transparent',
                          }}>
                            <td className="px-4 py-3 text-center" style={{ fontSize: '1.2rem' }}>
                              {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : (
                                <span style={{ color: '#6B7280', fontWeight: 700 }}>{idx + 1}</span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <div style={{ color: p.username === currentUser?.username ? '#FFD93D' : '#FFFFFF', fontWeight: 700 }}>
                                {p.name || p.username}
                                {p.username === currentUser?.username && <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ background: '#FFD93D', color: '#0B0B16', fontWeight: 700 }}>KAMU</span>}
                              </div>
                              <div style={{ color: '#6B7280', fontSize: '0.75rem' }}>@{p.username}</div>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span style={{ color: '#FFD93D', fontWeight: 800, fontSize: '1.1rem' }}>{p.totalScore}</span>
                            </td>
                            <td className="px-5 py-3 text-center">
                              <span style={{ color: '#4ADE80', fontWeight: 700 }}>{p.levelsPlayed}</span>
                              <span style={{ color: '#374151', fontSize: '0.75rem' }}>/{levels.filter(l => !l.isUserCreated).length}</span>
                            </td>
                            <td className="px-5 py-3 text-center" style={{ color: '#FFD93D', fontWeight: 700 }}>⭐ {p.stars}</td>
                            <td className="px-5 py-3 text-center" style={{ color: '#A78BFA', fontWeight: 600, fontFamily: 'monospace' }}>
                              {p.totalTime > 0 ? `${p.totalTime}s` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between flex-shrink-0">
                <p style={{ color: '#6B7280', fontSize: '0.7rem' }}>Urutan: semua dasar selesai → skor tertinggi → waktu tercepat</p>
                <p style={{ color: '#374151', fontSize: '0.7rem' }}>© 2026 Not My Style</p>
              </div>
            </div>
          </div>
        )}

        {showLivesClickModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #4ADE80' }}>
              <div className="text-6xl mb-4">💚</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#4ADE80', letterSpacing: '3px' }}>NYAWA MASIH TERSEDIA</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Pemulihan nyawa hanya tersedia ketika nyawa habis.</p>
              <button onClick={() => setShowLivesClickModal(false)} className="w-full px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#4ADE80', color: '#052e16', fontWeight: 700 }}>Tutup</button>
            </div>
          </div>
        )}

        {/* Difficulty Lock Popup */}
        {showDifficultyLockPopup && (() => {
          const diff = showDifficultyLockPopup;
          const dasarLevels = levels.filter(l => l.levelType === 'dasar');
          const mudahLevels = dasarLevels.filter(l => l.difficulty === 'Mudah');
          const sedangLevels = dasarLevels.filter(l => l.difficulty === 'Sedang');
          const mudahStars = mudahLevels.reduce((a, l) => a + (l.stars || 0), 0);
          const sedangStars = sedangLevels.reduce((a, l) => a + (l.stars || 0), 0);
          const currentStars = diff === 'Sedang' ? mudahStars : sedangStars;
          const requiredLevels = diff === 'Sedang' ? mudahLevels : sedangLevels;
          const completedCount = requiredLevels.filter(l => l.stars !== undefined).length;
          const allCompleted = completedCount === requiredLevels.length;
          const prevDiff = diff === 'Sedang' ? 'Mudah' : 'Sedang';
          return (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
              <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: `2px solid ${diff === 'Sedang' ? '#FFD93D' : '#FF6B6B'}` }}>
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="uppercase mb-3" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: diff === 'Sedang' ? '#FFD93D' : '#FF6B6B', letterSpacing: '2px' }}>
                  Kategori {diff} Belum Tersedia
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  Untuk memainkan tingkat <strong style={{ color: '#FFFFFF' }}>{diff}</strong>, kamu harus memenuhi <strong style={{ color: '#FFFFFF' }}>2 syarat</strong>:
                </p>
                <div className="space-y-3 mb-6">
                  <div className="p-4 rounded-xl text-left" style={{ background: '#0B0B16' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{currentStars >= 32 ? '✅' : '❌'}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Minimal 32 bintang dari Level {prevDiff}</span>
                    </div>
                    <p style={{ color: currentStars >= 32 ? '#4ADE80' : (diff === 'Sedang' ? '#FFD93D' : '#FF6B6B'), fontWeight: 800, fontSize: '1.3rem' }}>{currentStars} / 32 ⭐</p>
                  </div>
                  <div className="p-4 rounded-xl text-left" style={{ background: '#0B0B16' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{allCompleted ? '✅' : '❌'}</span>
                      <span style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>Selesaikan semua Level {prevDiff}</span>
                    </div>
                    <p style={{ color: allCompleted ? '#4ADE80' : (diff === 'Sedang' ? '#FFD93D' : '#FF6B6B'), fontWeight: 800, fontSize: '1.3rem' }}>{completedCount} / {requiredLevels.length} level</p>
                  </div>
                </div>
                <button onClick={() => setShowDifficultyLockPopup(null)}
                  className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                  style={{ background: diff === 'Sedang' ? '#FFD93D' : '#FF6B6B', color: diff === 'Sedang' ? '#0B0B16' : '#fff', fontWeight: 700 }}>
                  Tutup
                </button>
              </div>
            </div>
          );
        })()}

        {/* Tantangan Locked Popup */}
        {showTantanganIntro && !tantanganIntroLevel && !levels.filter(l => l.levelType === 'dasar').every(l => l.stars !== undefined) && (() => {
          const dasarDone = levels.filter(l => l.levelType === 'dasar' && l.stars !== undefined).length;
          return (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
              <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FB923C' }}>
                <div className="text-5xl mb-4">🔒</div>
                <h2 className="uppercase mb-3" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#FB923C', letterSpacing: '2px' }}>
                  Level Tantangan Terkunci
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                  Selesaikan seluruh Level Dasar terlebih dahulu untuk membuka Level Tantangan.
                </p>
                <div className="p-4 rounded-xl mb-6" style={{ background: '#0B0B16' }}>
                  <p style={{ color: '#FB923C', fontWeight: 800, fontSize: '1.5rem' }}>{dasarDone} / 48 Level Selesai</p>
                </div>
                <button onClick={() => setShowTantanganIntro(false)}
                  className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                  style={{ background: '#FB923C', color: '#fff', fontWeight: 700 }}>
                  Tutup
                </button>
              </div>
            </div>
          );
        })()}

        {/* Tantangan Intro Popup */}
        {showTantanganIntro && tantanganIntroLevel && !showLearningPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
            <div className="rounded-3xl p-8 max-w-lg w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FB923C' }}>
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#FB923C', letterSpacing: '2px' }}>LEVEL TANTANGAN</h2>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
                Selamat datang di Level Tantangan! Pada mode ini kamu akan menggabungkan berbagai properti CSS yang telah dipelajari pada Level Dasar. Perhatikan tampilan target dengan baik, kemudian sesuaikan nilai CSS hingga hasil preview menyerupai target. Jika lupa fungsi suatu properti CSS, gunakan tombol (?) untuk membuka kembali penjelasannya.
              </p>
              <button onClick={() => setShowTantanganIntro(false)}
                className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                style={{ background: '#FB923C', color: '#fff', fontWeight: 700 }}>
                Mulai Tantangan →
              </button>
            </div>
          </div>
        )}

        {/* Revive Modal — lives habis */}
        {showReviveModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FF6B6B' }}>
              <div className="text-6xl mb-4">💔</div>
              <h2 className="uppercase mb-3" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#FF6B6B', letterSpacing: '3px' }}>NYAWA HABIS!</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', lineHeight: 1.6 }}>
                Nyawamu sudah habis. Nyawa akan dipulihkan otomatis <strong style={{ color: '#FFD93D' }}>1 nyawa setiap 5 menit</strong>.
              </p>
              {reviveCountdown > 0 && (
                <div className="mb-6 p-4 rounded-2xl" style={{ background: '#0B0B16' }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '2rem', color: '#FFD93D', fontWeight: 800 }}>
                    ⏳ {Math.floor(reviveCountdown / 60)}:{(reviveCountdown % 60).toString().padStart(2, '0')}
                  </div>
                  <div style={{ color: '#4ADE80', fontSize: '0.8rem', marginTop: '4px' }}>+{reviveLivesQueue} nyawa dalam antrian</div>
                  <div className="mt-2 w-full rounded-full h-2" style={{ background: '#2D2D3A' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${((300 - reviveCountdown) / 300) * 100}%`, background: '#4ADE80' }} />
                  </div>
                </div>
              )}
              <button onClick={() => setShowReviveModal(false)}
                className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 700 }}>
                Tutup — Tunggu Pemulihan
              </button>
            </div>
          </div>
        )}

        {/* Revive Success Modal */}
        {showReviveSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.95)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #4ADE80' }}>
              <div className="text-6xl mb-4">💚</div>
              <h2 className="uppercase mb-3" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#4ADE80', letterSpacing: '3px' }}>NYAWA PULIH!</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Nyawamu telah dipulihkan. Semangat bermain!</p>
              <button onClick={() => setShowReviveSuccessModal(false)}
                className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                style={{ background: '#4ADE80', color: '#052e16', fontWeight: 700 }}>
                Lanjutkan Bermain →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── GAMEPLAY ────────────────────────────────────────────────────────────
  const renderGameplay = () => {
    if (!currentLevel) return null;
    const currentScore = calculateScore();

    return (
      <div className="min-h-screen" style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
        {/* Status Bar */}
        <div style={{ background: '#1E1E2E', borderBottom: '2px solid #2D2D3A' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button onClick={handleExitLevel}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: testMode ? '#6C5CE7' : '#2D2D3A', color: testMode ? '#fff' : '#9CA3AF', fontWeight: 600, border: testMode ? '1px solid rgba(108,92,231,0.5)' : 'none' }}>
                {testMode ? '←' : <Home className="w-4 h-4" />}
                {testMode ? 'Kembali ke Creator' : 'Kembali'}
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#2D2D3A' }}>
                <span style={{ letterSpacing: '2px', fontSize: '1.1rem' }}>
                  {[...Array(globalLives)].map((_, i) => <span key={i}>❤️</span>)}
                  {[...Array(3 - globalLives)].map((_, i) => <span key={i} style={{ opacity: 0.3 }}>🤍</span>)}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: timeLeft < 20 ? '#FF6B6B22' : '#2D2D3A', border: timeLeft < 20 ? '1px solid #FF6B6B' : '1px solid transparent' }}>
                <Clock className="w-4 h-4" style={{ color: timeLeft < 20 ? '#FF6B6B' : '#9CA3AF' }} />
                <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: timeLeft < 20 ? '#FF6B6B' : '#FFFFFF' }}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#2D2D3A' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#6C5CE7' }} />
                <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9rem' }}>Hint: {hintsUsed}</span>
              </div>
              <button onClick={handleHintRequest}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#6C5CE7', color: '#fff', fontWeight: 600 }}>
                <Sparkles className="w-4 h-4" />
                Hint
              </button>
              <button onClick={handleCheckAnswer}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#1591DC', color: '#fff', fontWeight: 600 }}>
                <CheckCircle2 className="w-4 h-4" />
                Periksa Jawaban
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Instructions */}
          <div className="mb-6 p-5 rounded-2xl" style={{ background: '#1E1E2E', border: '2px solid #1591DC44' }}>
            <h2 className="uppercase mb-2"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.8rem', color: '#FFD93D', letterSpacing: '2px' }}>
              {currentLevel.title}
            </h2>
            {currentLevel.concept && (
              <p style={{ color: '#1591DC', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>💡 {currentLevel.concept}</p>
            )}
            <p style={{ color: '#E5E7EB', fontSize: '0.95rem', lineHeight: 1.6 }}>{currentLevel.description}</p>
          </div>

          {/* Preview panels */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', color: '#FFFFFF', letterSpacing: '2px' }}>NILAIMU</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>EDITABLE</span>
              </div>
              <div id="player-container" className="rounded-2xl p-6"
                style={{ background: '#1E1E2E', border: '2px solid #2D2D3A', overflow: 'auto', width: '100%' }}>
                <div id="player-preview" dangerouslySetInnerHTML={{ __html: currentLevel.htmlStructure }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', color: '#FFD93D', letterSpacing: '2px' }}>NILAI TARGET</span>
                <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#FFD93D22', color: '#FFD93D', fontWeight: 600, border: '1px solid #FFD93D44' }}>TUJUAN</span>
              </div>
              <div id="target-container" className="rounded-2xl p-6"
                style={{ background: '#1E1E2E', border: '2px solid #FFD93D44', width: '100%' }}>
                <div id="target-preview" dangerouslySetInnerHTML={{ __html: currentLevel.htmlStructure }} />
              </div>
            </div>
          </div>

          {/* CSS Editor — preset value buttons */}
          <div className="rounded-2xl p-6" style={{ background: '#1E1E2E', border: '2px solid #2D2D3A' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="uppercase" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.5rem', color: '#FFFFFF', letterSpacing: '2px' }}>CSS EDITOR</span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: '#FF6B6B' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#FFD93D' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#4ADE80' }} />
              </div>
            </div>

            {hintRevealed.length > 0 && (
              <div className="mb-5 p-4 rounded-xl" style={{ background: '#6C5CE722', border: '1px solid #6C5CE755' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#6C5CE7' }} />
                  <span style={{ color: '#A78BFA', fontWeight: 700, fontSize: '0.85rem' }}>HINT TERUNGKAP ({hintRevealed.length})</span>
                  <span style={{ color: '#FF6B6B', fontSize: '0.75rem' }}>(-10 poin/hint)</span>
                </div>
                {hintRevealed.map((h, i) => (
                  <p key={i} className="mb-1" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '0.85rem' }}>
                    💡 <span style={{ color: '#FFD93D', fontFamily: 'monospace' }}>{h.hint}</span>
                  </p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentLevel.propertyConfigs.map(config => {
                const def = PREDEFINED_PROPERTIES[config.name];
                if (!def) return null;
                const current = playerValues[config.name] || config.initialValue;

                return (
                  <div key={config.name} className="p-4 rounded-xl" style={{ background: '#0B0B16', border: '1px solid #2D2D3A' }}>
                    <div className="mb-1">
                      <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>{config.name}</label>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.68rem', marginBottom: '10px' }}>{def.description}</p>

                    {/* Preset value buttons */}
                    {(config.name === 'background-color' || config.name === 'color') ? (
                      // Color swatches with labels
                      <div className="flex flex-wrap gap-2">
                        {def.values.map((val, i) => {
                          const isLight = ['#ffffff', '#f59e0b'].includes(val);
                          const isActive = current === val;
                          return (
                            <button key={val} onClick={() => setPlayerValues(pv => ({ ...pv, [config.name]: val }))}
                              className="flex flex-col items-center gap-0.5 rounded-lg p-1 transition-all hover:scale-105"
                              style={{
                                background: isActive ? 'rgba(255,217,61,0.15)' : 'transparent',
                                border: isActive ? '2px solid #FFD93D' : '2px solid transparent',
                              }}>
                              <div className="w-8 h-8 rounded-md" style={{
                                background: val,
                                border: isLight ? '1px solid #4B5563' : '1px solid transparent',
                                boxShadow: isActive ? '0 0 8px rgba(255,217,61,0.5)' : 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                              }} />
                              <span style={{ fontSize: '0.6rem', color: '#9CA3AF', lineHeight: 1 }}>{def.displayValues?.[i] || val}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {def.values.map((val, i) => {
                          const label = def.displayValues?.[i] || val;
                          const isActive = current === val;
                          return (
                            <button key={val} onClick={() => setPlayerValues(pv => ({ ...pv, [config.name]: val }))}
                              className="px-2.5 py-1 rounded-lg text-xs transition-all hover:scale-105"
                              style={{
                                background: isActive ? '#FFD93D' : '#1E1E2E',
                                color: isActive ? '#0B0B16' : '#9CA3AF',
                                border: isActive ? '1px solid #FFD93D' : '1px solid #3D3D4A',
                                fontWeight: isActive ? 700 : 500,
                              }}>
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Current value display */}
                    <div className="mt-2 text-right">
                      <span style={{ color: '#4ADE80', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        {getDisplayValue(config.name, current)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hint Modal */}
        {showHintModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.85)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full" style={{ background: '#1E1E2E', border: '2px solid #6C5CE7' }}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🧮</div>
                <h2 className="uppercase mb-2" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: '#FFFFFF', letterSpacing: '2px' }}>SELESAIKAN SOAL INI</h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Jawab soal matematika untuk mendapatkan hint:</p>
              </div>
              <div className="text-center py-6 rounded-2xl mb-6"
                style={{ background: '#0B0B16', fontFamily: "'Bebas Neue', cursive", fontSize: '3rem', color: '#FFD93D', letterSpacing: '2px' }}>
                {mathQuestion.question}
              </div>
              <input type="number" value={mathInput} onChange={e => setMathInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleMathSubmit()}
                className="w-full px-4 py-3 rounded-xl text-center text-lg mb-4 outline-none"
                style={{ background: '#0B0B16', border: '2px solid #3D3D4A', color: '#FFFFFF' }} placeholder="Jawaban kamu..." />
              <div className="flex gap-3">
                <button onClick={handleMathSubmit} className="flex-1 px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>Submit</button>
                <button onClick={() => setShowHintModal(false)} className="px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* Validation Modal */}
        {showValidationModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FF6B6B' }}>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#FF6B6B', letterSpacing: '3px' }}>JAWABAN BELUM SESUAI</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.6 }}>
                Masih terdapat beberapa properti yang belum sama dengan target.
              </p>
              <button onClick={() => setShowValidationModal(false)} className="w-full px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#1591DC', color: '#fff', fontWeight: 700 }}>Lanjutkan Bermain</button>
            </div>
          </div>
        )}

        {/* Win Modal */}
        {showWinModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FFD93D' }}>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '3rem', color: '#FFD93D', letterSpacing: '3px' }}>LEVEL BERHASIL!</h2>
              <div className="flex justify-center gap-3 mb-6">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-12 h-12" style={{ fill: i < getStars() ? '#FFD93D' : 'transparent', color: i < getStars() ? '#FFD93D' : '#3D3D4A' }} />
                ))}
              </div>
              {/* Score display */}
              <div className="mb-4 py-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,217,61,0.15), rgba(255,217,61,0.05))', border: '1px solid rgba(255,217,61,0.3)' }}>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '3rem', color: '#FFD93D', letterSpacing: '3px', lineHeight: 1 }}>{score}</div>
                <div style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>SKOR</div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Waktu</span>
                  <span style={{ color: '#4ADE80', fontWeight: 700 }}>{currentLevel ? currentLevel.timeLimit - timeLeft : 0}s</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Hint Digunakan</span>
                  <span style={{ color: hintsUsed > 0 ? '#FB923C' : '#4ADE80', fontWeight: 700 }}>{hintsUsed} {hintsUsed > 0 ? `(-${hintsUsed * 15} poin)` : ''}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 rounded-xl" style={{ background: '#0B0B16' }}>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Bonus Waktu</span>
                  <span style={{ color: '#1591DC', fontWeight: 700 }}>{currentLevel ? `${Math.round((timeLeft / currentLevel.timeLimit) * 50)} poin` : '-'}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => {
                  setShowWinModal(false);
                  const currentId = currentLevel?.id;
                  const idx = levels.findIndex(l => l.id === currentId);
                  if (idx >= 0 && idx < levels.length - 1) startLevel(levels[idx + 1]);
                  else { setCurrentLevel(null); setScreen('player-gallery'); }
                }} className="flex-1 px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#4ADE80', color: '#052e16', fontWeight: 800 }}>
                  Lanjutkan Level →
                </button>
                <button onClick={() => { setShowWinModal(false); setScreen('player-gallery'); }}
                  className="px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                  Kembali
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Learning Popup - appears on top of gameplay */}
        {showLearningPopup && learningLevel && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.75)' }}>
            <div className="rounded-3xl p-8 max-w-lg w-full" style={{ background: '#1E1E2E', border: `2px solid ${isInitialPopup ? '#1591DC' : '#FFD93D'}` }}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">{isInitialPopup ? '📖' : '❓'}</div>
                <h2 className="uppercase mb-2" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2rem', color: isInitialPopup ? '#1591DC' : '#FFD93D', letterSpacing: '2px' }}>
                  {isInitialPopup ? 'MATERI PEMBELAJARAN' : 'BANTUAN CSS'}
                </h2>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>{learningLevel.title}</p>
              </div>
              <div className="space-y-4 mb-6" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {learningLevel.propertyConfigs.map((pc, idx) => {
                  const mat = CSS_MATERIALS[pc.name];
                  return (
                    <div key={idx} className="p-4 rounded-xl" style={{ background: '#0B0B16', border: '1px solid #2D2D3A' }}>
                      <h3 style={{ color: '#FFD93D', fontWeight: 700, fontSize: '1rem', marginBottom: '8px' }}>{PREDEFINED_PROPERTIES[pc.name]?.label || pc.name}</h3>
                      <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '6px' }}><strong style={{ color: '#FFFFFF' }}>Pengertian:</strong> {mat?.pengertian || 'Properti CSS untuk mengatur tampilan elemen.'}</p>
                      <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}><strong style={{ color: '#FFFFFF' }}>Fungsi:</strong> {mat?.fungsi || 'Mengatur tampilan visual elemen.'}</p>
                    </div>
                  );
                })}
              </div>
              {isInitialPopup ? (
                <button onClick={() => { setShowLearningPopup(false); setIsInitialPopup(false); }}
                  className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                  style={{ background: '#1591DC', color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                  Mulai Bermain →
                </button>
              ) : (
                <button onClick={() => { setShowLearningPopup(false); setIsInitialPopup(false); }}
                  className="w-full px-6 py-3 rounded-xl hover:opacity-80"
                  style={{ background: '#FFD93D', color: '#0B0B16', fontWeight: 700, fontSize: '1rem' }}>
                  Tutup
                </button>
              )}
              <p style={{ color: '#374151', fontSize: '0.65rem', textAlign: 'center', marginTop: '12px' }}>© 2026 Not My Style | Muhamad Rizki Hidayat</p>
            </div>
          </div>
        )}

        {/* Help FAB - Floating Action Button */}
        {currentLevel && !showLearningPopup && !showWinModal && (
          <button
            onClick={() => {
              setLearningLevel(currentLevel);
              setIsInitialPopup(false);
              setShowLearningPopup(true);
            }}
            className="fixed z-40 flex items-center justify-center rounded-full shadow-lg hover:scale-110 transition-transform"
            style={{
              bottom: '24px',
              right: '24px',
              width: '56px',
              height: '56px',
              background: '#FFD93D',
              color: '#0B0B16',
              border: '3px solid #0B0B16',
              boxShadow: '0 4px 20px rgba(255,217,61,0.4)',
            }}>
            <HelpCircle className="w-7 h-7" />
          </button>
        )}

        {/* Exit Confirm Modal */}
        {showExitConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: `2px solid ${testMode ? '#6C5CE7' : '#FB923C'}` }}>
              <div className="text-6xl mb-4">{testMode ? '🧪' : '⚠️'}</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: testMode ? '#6C5CE7' : '#FB923C', letterSpacing: '3px' }}>
                {testMode ? 'KEMBALI KE CREATOR?' : 'KELUAR DARI LEVEL?'}
              </h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.6 }}>
                {testMode ? 'Kamu akan kembali ke halaman Creator untuk melanjutkan mengedit level.' : 'Keluar dari level akan mengurangi 1 nyawa. Apakah kamu yakin?'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirmModal(false)} className="flex-1 px-6 py-3 rounded-xl hover:opacity-80" style={{ background: testMode ? '#6C5CE7' : '#1591DC', color: '#fff', fontWeight: 700 }}>
                  {testMode ? 'Lanjut Test' : 'Tetap Bermain'}
                </button>
                <button onClick={confirmExitLevel} className="flex-1 px-6 py-3 rounded-xl hover:opacity-80" style={{ background: testMode ? '#2D2D3A' : '#FF6B6B', color: '#fff', fontWeight: 600 }}>
                  {testMode ? '← Kembali' : 'Keluar Level'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Math Error Modal */}
        {showMathErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FF6B6B' }}>
              <div className="text-6xl mb-4">❌</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#FF6B6B', letterSpacing: '3px' }}>JAWABAN SALAH</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Jawaban matematika kamu salah. Coba lagi!</p>
              <button onClick={() => setShowMathErrorModal(false)} className="w-full px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#1591DC', color: '#fff', fontWeight: 700 }}>Coba Lagi</button>
            </div>
          </div>
        )}

        {/* Gameplay Footer */}
        <div className="text-center py-4" style={{ borderTop: '1px solid #1E1E2E', marginTop: '20px' }}>
          <p style={{ color: '#374151', fontSize: '0.7rem' }}>© 2026 Not My Style | Muhamad Rizki Hidayat</p>
        </div>
      </div>
    );
  };

  // ─── CREATOR ─────────────────────────────────────────────────────────────
  const renderCreator = () => {
    const alreadyAdded = new Set(creatorProperties.map(p => p.name));
    const availableToAdd = Object.keys(PREDEFINED_PROPERTIES).filter(k => !alreadyAdded.has(k));

    return (
      <div className="min-h-screen" style={{ background: '#0B0B16', fontFamily: "'Space Grotesk', sans-serif" }}>
        {/* Header */}
        <div style={{ background: '#1E1E2E', borderBottom: '1px solid #2D2D3A' }}>
          <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.6rem', color: '#FFD93D', letterSpacing: '2px' }}>NOT MY STYLE</span>
              <span className="px-3 py-1 rounded-full text-xs" style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>CREATOR MODE</span>
              {currentUser && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(108,92,231,0.15)', border: '1px solid rgba(108,92,231,0.3)' }}>
                  <span style={{ fontSize: '0.8rem' }}>🛠️</span>
                  <span style={{ color: '#A78BFA', fontSize: '0.8rem', fontWeight: 600 }}>{currentUser.username}</span>
                  <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>DEVELOPER</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setScreen(currentUser?.role === 'developer' ? 'developer' : 'player-gallery')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#2D2D3A', color: '#A78BFA', fontWeight: 600, border: '1px solid rgba(108,92,231,0.3)' }}>
                ← {currentUser?.role === 'developer' ? 'Dashboard' : 'Gallery'}
              </button>
              <button onClick={handleGoHome}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#2D2D3A', color: '#9CA3AF', fontWeight: 600 }}>
                <Home className="w-4 h-4" />
                Home
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-80"
                style={{ background: '#FF6B6B22', color: '#FF6B6B', fontWeight: 600, border: '1px solid #FF6B6B44' }}>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="mb-6">
            <p className="text-xs tracking-widest mb-1" style={{ color: '#6C5CE7', fontWeight: 700 }}>✦ BUAT LEVEL BARU</p>
            <h1 className="uppercase"
              style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#FFFFFF', letterSpacing: '3px' }}>
              CREATE <span style={{ color: '#6C5CE7' }}>LEVEL</span>
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6">

            {/* LEFT — Properti HTML + Properti CSS */}
            <div className="rounded-2xl p-6" style={{ background: '#1E1E2E', border: '1px solid #2D2D3A' }}>

              {/* PROPERTI HTML */}
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '2px', marginBottom: '12px' }}>
                PROPERTI <span style={{ color: '#4ADE80' }}>HTML</span>
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {HTML_TEMPLATES.map(t => (
                  <button key={t.name} onClick={() => setCreatorHtml(t.html)}
                    className="flex flex-col gap-1 px-3 py-2.5 rounded-lg text-left transition-all duration-150 hover:scale-[1.02]"
                    style={{
                      background: creatorHtml === t.html ? 'rgba(74,222,128,0.15)' : '#0B0B16',
                      border: creatorHtml === t.html ? '1.5px solid #4ADE80' : '1.5px solid #3D3D4A',
                    }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{t.icon}</span>
                      <span style={{ color: creatorHtml === t.html ? '#4ADE80' : '#FFFFFF', fontSize: '0.75rem', fontWeight: 700 }}>{t.name}</span>
                    </div>
                    <span style={{ color: '#6B7280', fontSize: '0.62rem', lineHeight: 1.3 }}>{t.description}</span>
                  </button>
                ))}
              </div>
              {creatorHtml && (() => {
                const selected = HTML_TEMPLATES.find(t => t.html === creatorHtml);
                if (!selected) return null;
                return (
                  <div className="mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <p style={{ color: '#4ADE80', fontSize: '0.68rem', fontWeight: 600, marginBottom: '4px' }}>
                      ✅ Template "{selected.name}"
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selected.suggestedProps.map(p => (
                        <span key={p} className="px-2 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.15)', color: '#4ADE80', fontSize: '0.6rem', fontWeight: 600 }}>
                          {PREDEFINED_PROPERTIES[p]?.label || p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* PROPERTI CSS */}
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '2px', marginBottom: '16px' }}>
                PROPERTI <span style={{ color: '#6C5CE7' }}>CSS</span>
              </h2>

              {/* Add property */}
              {availableToAdd.length > 0 && (
                <div className="flex gap-2 mb-5">
                  <select value={selectedPropToAdd} onChange={e => setSelectedPropToAdd(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl outline-none text-sm"
                    style={{ background: '#0B0B16', border: '1px solid #3D3D4A', color: '#FFFFFF' }}>
                    {PREDEFINED_CATEGORIES.map(cat => (
                      <optgroup key={cat} label={cat}>
                        {Object.entries(PREDEFINED_PROPERTIES)
                          .filter(([, v]) => v.category === cat && !alreadyAdded.has(Object.keys(PREDEFINED_PROPERTIES).find(k => PREDEFINED_PROPERTIES[k] === v)!))
                          .map(([key, def]) => !alreadyAdded.has(key) && (
                            <option key={key} value={key}>{def.label}</option>
                          ))}
                      </optgroup>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (!selectedPropToAdd || alreadyAdded.has(selectedPropToAdd)) return;
                      const def = PREDEFINED_PROPERTIES[selectedPropToAdd];
                      setCreatorProperties(prev => [...prev, {
                        name: selectedPropToAdd,
                        initialValue: def.values[0],
                        targetValue: def.values[def.values.length > 1 ? 1 : 0],
                      }]);
                      const remaining = availableToAdd.filter(k => k !== selectedPropToAdd);
                      if (remaining.length > 0) setSelectedPropToAdd(remaining[0]);
                    }}
                    className="px-3 py-2 rounded-xl hover:opacity-80"
                    style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Category pills reference */}
              <div className="space-y-1 mb-5">
                {PREDEFINED_CATEGORIES.map(cat => {
                  const propsInCat = Object.entries(PREDEFINED_PROPERTIES).filter(([, v]) => v.category === cat);
                  return (
                    <div key={cat}>
                      <p style={{ color: '#6B7280', fontSize: '0.65rem', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{cat}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {propsInCat.map(([key, def]) => (
                          <span key={key} className="px-2 py-0.5 rounded text-xs"
                            style={{ background: alreadyAdded.has(key) ? '#6C5CE7' : '#2D2D3A', color: alreadyAdded.has(key) ? '#fff' : '#6B7280', fontWeight: 600 }}>
                            {def.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected properties list */}
              <h3 style={{ color: '#9CA3AF', fontSize: '0.75rem', fontWeight: 700, marginBottom: '8px' }}>PROPERTI TERPILIH ({creatorProperties.length})</h3>
              <div className="space-y-2">
                {creatorProperties.map((prop, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl"
                    style={{ background: '#0B0B16', border: '1px solid #2D2D3A' }}>
                    <div>
                      <span style={{ color: '#FFFFFF', fontFamily: 'monospace', fontSize: '0.8rem' }}>{prop.name}</span>
                      <span style={{ color: '#6B7280', fontSize: '0.68rem', marginLeft: '8px' }}>
                        {getDisplayValue(prop.name, prop.initialValue)} → {getDisplayValue(prop.name, prop.targetValue)}
                      </span>
                    </div>
                    <button onClick={() => setCreatorProperties(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-1.5 rounded-lg hover:opacity-80" style={{ background: '#FF6B6B22', color: '#FF6B6B' }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {creatorProperties.length === 0 && (
                  <p style={{ color: '#6B7280', fontSize: '0.8rem', textAlign: 'center', padding: '16px 0' }}>Belum ada properti dipilih</p>
                )}
              </div>
            </div>

            {/* CENTER — Live Preview */}
            <div className="rounded-2xl p-6" style={{ background: '#1E1E2E', border: '1px solid #2D2D3A' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '2px', marginBottom: '16px' }}>
                PREVIEW <span style={{ color: '#FFD93D' }}>LEVEL</span>
              </h2>

              {/* Two preview panels */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Player initial values */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#FB923C', color: '#fff', fontWeight: 700 }}>NILAI PEMAIN</span>
                  </div>
                  <div id="creator-player-preview" className="rounded-xl p-4 overflow-auto" style={{ border: '2px solid #3D3D4A', background: '#f8f8f8' }}>
                    {creatorHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: creatorHtml }} />
                    ) : (
                      <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', paddingTop: '40px' }}>Pilih template HTML...</p>
                    )}
                  </div>
                </div>

                {/* Target values */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#4ADE80', color: '#052e16', fontWeight: 700 }}>NILAI TARGET</span>
                  </div>
                  <div id="creator-target-preview" className="rounded-xl p-4 overflow-auto" style={{ border: '2px solid #4ADE80', background: '#f8f8f8' }}>
                    {creatorHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: creatorHtml }} />
                    ) : (
                      <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', paddingTop: '40px' }}>Pilih template HTML...</p>
                    )}
                  </div>
                </div>
              </div>

              {creatorProperties.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {creatorProperties.map((p, i) => (
                    <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: '#0B0B16', color: '#9CA3AF' }}>
                      <span style={{ color: '#FB923C', fontWeight: 600 }}>{getDisplayValue(p.name, p.initialValue)}</span>
                      <span style={{ color: '#6B7280' }}> → </span>
                      <span style={{ color: '#4ADE80', fontWeight: 600 }}>{getDisplayValue(p.name, p.targetValue)}</span>
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  if (!creatorTitle || creatorProperties.length === 0) { setShowCreatorErrorModal(true); return; }
                  setTestMode(true);
                  startLevel({
                    id: 'test-level', title: creatorTitle, difficulty: creatorDifficulty,
                    levelType: 'custom',
                    description: creatorDescription, htmlStructure: creatorHtml,
                    propertyConfigs: creatorProperties, timeLimit: creatorTimeLimit,
                  });
                }}
                className="w-full mt-4 px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-80"
                style={{ background: '#6C5CE7', color: '#fff', fontWeight: 700 }}>
                <TestTube2 className="w-4 h-4" />
                TEST LEVEL
              </button>

              {/* Property value configuration — below TEST LEVEL */}
              {creatorProperties.length > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: '#2D2D3A' }}>
                  <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
                    NILAI AWAL & TARGET SETIAP PROPERTI
                  </label>
                  <div className="space-y-3">
                    {creatorProperties.map((prop, index) => {
                      const def = PREDEFINED_PROPERTIES[prop.name];
                      if (!def) return null;
                      return (
                        <div key={index} className="p-3 rounded-xl" style={{ background: '#0B0B16', border: '1px solid #2D2D3A' }}>
                          <div style={{ color: '#FFD93D', fontSize: '0.78rem', fontWeight: 700, marginBottom: '8px', fontFamily: 'monospace' }}>
                            {prop.name}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label style={{ color: '#6B7280', fontSize: '0.65rem', display: 'block', marginBottom: '6px' }}>Nilai Awal</label>
                              {(prop.name === 'background-color' || prop.name === 'color') ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {def.values.map((val, i) => {
                                    const isLight = ['#ffffff', '#f59e0b'].includes(val);
                                    const isSelected = prop.initialValue === val;
                                    return (
                                      <button key={val} onClick={() => {
                                        const updated = [...creatorProperties];
                                        updated[index] = { ...updated[index], initialValue: val };
                                        setCreatorProperties(updated);
                                      }} className="flex flex-col items-center gap-0.5 rounded-lg p-1 transition-all"
                                        style={{ background: isSelected ? 'rgba(255,217,61,0.15)' : 'transparent', border: isSelected ? '2px solid #FFD93D' : '2px solid transparent' }}>
                                        <div className="w-7 h-7 rounded-md" style={{ background: val, border: isLight ? '1px solid #4B5563' : '1px solid transparent', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }} />
                                        <span style={{ fontSize: '0.55rem', color: '#9CA3AF', lineHeight: 1 }}>{def.displayValues?.[i] || val}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <select value={prop.initialValue} onChange={e => {
                                  const updated = [...creatorProperties];
                                  updated[index] = { ...updated[index], initialValue: e.target.value };
                                  setCreatorProperties(updated);
                                }} className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
                                  style={{ background: '#1E1E2E', border: '1px solid #3D3D4A', color: '#FFFFFF' }}>
                                  {def.values.map((val, i) => (
                                    <option key={val} value={val}>{def.displayValues?.[i] || val}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <div>
                              <label style={{ color: '#6B7280', fontSize: '0.65rem', display: 'block', marginBottom: '6px' }}>Nilai Target</label>
                              {(prop.name === 'background-color' || prop.name === 'color') ? (
                                <div className="flex flex-wrap gap-1.5">
                                  {def.values.map((val, i) => {
                                    const isLight = ['#ffffff', '#f59e0b'].includes(val);
                                    const isSelected = prop.targetValue === val;
                                    return (
                                      <button key={val} onClick={() => {
                                        const updated = [...creatorProperties];
                                        updated[index] = { ...updated[index], targetValue: val };
                                        setCreatorProperties(updated);
                                      }} className="flex flex-col items-center gap-0.5 rounded-lg p-1 transition-all"
                                        style={{ background: isSelected ? 'rgba(74,222,128,0.15)' : 'transparent', border: isSelected ? '2px solid #4ADE80' : '2px solid transparent' }}>
                                        <div className="w-7 h-7 rounded-md" style={{ background: val, border: isLight ? '1px solid #4B5563' : '1px solid transparent', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }} />
                                        <span style={{ fontSize: '0.55rem', color: '#9CA3AF', lineHeight: 1 }}>{def.displayValues?.[i] || val}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              ) : (
                                <select value={prop.targetValue} onChange={e => {
                                  const updated = [...creatorProperties];
                                  updated[index] = { ...updated[index], targetValue: e.target.value };
                                  setCreatorProperties(updated);
                                }} className="w-full px-2 py-1.5 rounded-lg text-xs outline-none"
                                  style={{ background: '#1E1E2E', border: '1px solid #3D3D4A', color: '#FFFFFF' }}>
                                  {def.values.map((val, i) => (
                                    <option key={val} value={val}>{def.displayValues?.[i] || val}</option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Level Config + Property Value Config */}
            <div className="rounded-2xl p-6" style={{ background: '#1E1E2E', border: '1px solid #2D2D3A' }}>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '1.2rem', color: '#FFFFFF', letterSpacing: '2px', marginBottom: '16px' }}>
                KONFIGURASI <span style={{ color: '#FFD93D' }}>LEVEL</span>
              </h2>
              <div className="space-y-4">

                {/* Basic fields */}
                {[
                  { label: 'Nama Level', el: <input type="text" value={creatorTitle} onChange={e => setCreatorTitle(e.target.value)} className="w-full px-3 py-2.5 rounded-xl outline-none text-sm" style={{ background: '#0B0B16', border: '1px solid #3D3D4A', color: '#FFFFFF' }} /> },
                  { label: 'Deskripsi', el: <textarea value={creatorDescription} onChange={e => setCreatorDescription(e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-xl outline-none text-sm resize-none" style={{ background: '#0B0B16', border: '1px solid #3D3D4A', color: '#FFFFFF' }} /> },
                ].map(({ label, el }) => (
                  <div key={label}>
                    <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>{label.toUpperCase()}</label>
                    {el}
                  </div>
                ))}

                {/* Waktu Tantangan */}
                <div>
                  <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>WAKTU (DETIK)</label>
                  <div className="flex gap-2">
                    {[120, 150, 180, 210, 300].map(t => (
                      <button key={t} onClick={() => setCreatorTimeLimit(t)}
                        className="flex-1 px-2 py-2 rounded-xl text-xs transition-all"
                        style={{
                          background: creatorTimeLimit === t ? '#FB923C' : '#0B0B16',
                          color: creatorTimeLimit === t ? '#fff' : '#9CA3AF',
                          border: `1px solid ${creatorTimeLimit === t ? '#FB923C' : '#3D3D4A'}`,
                          fontWeight: creatorTimeLimit === t ? 700 : 500,
                        }}>
                        {t}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* HTML Code */}
                <div>
                  <label style={{ color: '#9CA3AF', fontSize: '0.72rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>KODE HTML</label>
                  <textarea value={creatorHtml} onChange={e => setCreatorHtml(e.target.value)} rows={5} className="w-full px-3 py-2.5 rounded-xl outline-none text-sm resize-none font-mono" style={{ background: '#0B0B16', border: '1px solid #3D3D4A', color: '#4ADE80' }} placeholder="Pilih template di kiri atau ketik HTML manual..." />
                </div>

                <button onClick={handleSaveLevel}
                  className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-80"
                  style={{ background: '#FFD93D', color: '#0B0B16', fontWeight: 800 }}>
                  <Play className="w-4 h-4" />
                  SIMPAN LEVEL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Level Modal */}
        {showSaveLevelModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #4ADE80' }}>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#4ADE80', letterSpacing: '3px' }}>LEVEL TERSIMPAN</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Level berhasil disimpan! Kamu bisa menemukannya di Level Gallery.</p>
              <button onClick={() => setShowSaveLevelModal(false)} className="w-full px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#4ADE80', color: '#052e16', fontWeight: 700 }}>OK</button>
            </div>
          </div>
        )}

        {/* Creator Error Modal */}
        {showCreatorErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(11,11,22,0.9)' }}>
            <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ background: '#1E1E2E', border: '2px solid #FB923C' }}>
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', cursive", fontSize: '2.5rem', color: '#FB923C', letterSpacing: '3px' }}>DATA BELUM LENGKAP</h2>
              <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Isi judul level dan tambahkan minimal 1 properti terlebih dahulu!</p>
              <button onClick={() => setShowCreatorErrorModal(false)} className="w-full px-6 py-3 rounded-xl hover:opacity-80" style={{ background: '#FB923C', color: '#fff', fontWeight: 700 }}>OK</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {screen === 'splash'          && renderSplashScreen()}
      {screen === 'login'           && renderLoginScreen()}
      {screen === 'register'        && renderRegisterScreen()}
      {screen === 'player-gallery'  && renderPlayerGallery()}
      {screen === 'gameplay'        && renderGameplay()}
      {screen === 'creator'         && renderCreator()}
      {screen === 'developer'       && renderDeveloperScreen()}
    </>
  );
}
