import React, { useState } from 'react';
import classNames from 'classnames';

import { useIntl } from '../../util/reactIntl';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { connect } from 'react-redux';

import {
  Page,
  UserNav,
  LayoutSingleColumn,
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';

import css from './SyncDashboardPage.module.css';

// ─── Integration Card Data ─────────────────────────────────────
const INTEGRATIONS = [
  {
    id: 'api',
    title: 'API REST',
    desc: 'Connectez directement votre systeme a COBUCO via notre API. Synchronisation en temps reel, controle total.',
    icon: css.iconApi,
    emoji: '\u{1F50C}',
    difficulty: 3,
    difficultyLabel: 'Technique',
    difficultyColor: 'default',
    tags: [
      { label: 'Temps reel', style: 'sync' },
      { label: 'Bidirectionnel', style: 'auto' },
      { label: 'Illimite', style: 'default' },
    ],
    status: 'active',
    featured: true,
    buttons: [
      { label: 'Gerer ma cle API', type: 'primary' },
      { label: 'Documentation', type: 'secondary' },
    ],
  },
  {
    id: 'excel',
    title: 'Import Excel / CSV',
    desc: 'Telechargez notre modele, remplissez vos annonces, et importez-les en un clic. Ideal pour demarrer.',
    icon: css.iconExcel,
    emoji: '\u{1F4D7}',
    difficulty: 1,
    difficultyLabel: 'Facile',
    difficultyColor: 'green',
    tags: [
      { label: 'Sans code', style: 'easy' },
      { label: 'Import en masse', style: 'default' },
    ],
    status: 'ready',
    featured: false,
    buttons: [
      { label: 'Importer un fichier', type: 'primary' },
      { label: 'Telecharger le modele', type: 'secondary' },
    ],
  },
  {
    id: 'zapier',
    title: 'Zapier / Make',
    desc: 'Connectez COBUCO a 5000+ applications sans coder. Google Sheets, Airtable, CRM, emails et plus.',
    icon: css.iconZapier,
    emoji: '\u26A1',
    difficulty: 2,
    difficultyLabel: 'Moyen',
    difficultyColor: 'green',
    tags: [
      { label: 'Sans code', style: 'easy' },
      { label: 'Automatique', style: 'auto' },
      { label: '5000+ apps', style: 'default' },
    ],
    status: 'coming',
    featured: false,
    buttons: [{ label: 'Bientot disponible', type: 'disabled' }],
  },
  {
    id: 'pms',
    title: 'Logiciel de gestion (PMS)',
    desc: 'Connectez Nexudus, OfficeRnD, Archie ou votre PMS directement a COBUCO. Sync automatique de vos espaces.',
    icon: css.iconPms,
    emoji: '\u{1F3E2}',
    difficulty: 1,
    difficultyLabel: 'Facile',
    difficultyColor: 'green',
    tags: [
      { label: 'Automatique', style: 'auto' },
      { label: 'Temps reel', style: 'sync' },
    ],
    status: 'coming',
    featured: false,
    buttons: [{ label: 'Bientot disponible', type: 'disabled' }],
  },
  {
    id: 'ubiflow',
    title: 'Ubiflow (Multidiffusion)',
    desc: 'Si vous utilisez deja Ubiflow pour diffuser vos annonces, activez COBUCO en un clic depuis leur interface.',
    icon: css.iconUbiflow,
    emoji: '\u{1F310}',
    difficulty: 1,
    difficultyLabel: 'Facile',
    difficultyColor: 'green',
    tags: [
      { label: '1 clic', style: 'easy' },
      { label: 'BureauxLocaux', style: 'default' },
      { label: 'SeLoger', style: 'default' },
    ],
    status: 'coming',
    featured: false,
    buttons: [{ label: 'Bientot disponible', type: 'disabled' }],
  },
  {
    id: 'xml',
    title: 'Flux XML / RSS',
    desc: "Fournissez l'URL de votre flux XML et COBUCO importera automatiquement vos annonces periodiquement.",
    icon: css.iconXml,
    emoji: '\u{1F4E1}',
    difficulty: 2,
    difficultyLabel: 'Moyen',
    difficultyColor: 'orange',
    tags: [
      { label: 'Automatique', style: 'auto' },
      { label: 'Periodique', style: 'default' },
    ],
    status: 'coming',
    featured: false,
    buttons: [{ label: 'Bientot disponible', type: 'disabled' }],
  },
];

const SYNC_HISTORY = [
  {
    title: 'Bureau privatif 4 postes - La Defense',
    method: 'API',
    methodEmoji: '\u{1F50C}',
    action: 'Creation',
    status: 'success',
    statusLabel: 'Reussi',
    date: 'il y a 3 min',
  },
  {
    title: 'Open Space 20 postes - Chatelet',
    method: 'API',
    methodEmoji: '\u{1F50C}',
    action: 'Mise a jour',
    status: 'success',
    statusLabel: 'Reussi',
    date: 'il y a 15 min',
  },
  {
    title: 'Salle de reunion 8p - Nation',
    method: 'Excel',
    methodEmoji: '\u{1F4D7}',
    action: 'Creation',
    status: 'success',
    statusLabel: 'Reussi',
    date: 'il y a 1h',
  },
  {
    title: 'Bureau 2 postes - Opera',
    method: 'Excel',
    methodEmoji: '\u{1F4D7}',
    action: 'Creation',
    status: 'error',
    statusLabel: 'Erreur photo',
    date: 'il y a 1h',
  },
  {
    title: 'Coworking flexible - Bastille',
    method: 'API',
    methodEmoji: '\u{1F50C}',
    action: 'Suppression',
    status: 'pending',
    statusLabel: 'En cours',
    date: 'il y a 2h',
  },
];

// ─── Difficulty Dots ────────────────────────────────────────────
const DifficultyDots = ({ level, color }) => {
  const colorClass = color === 'green' ? css.dotGreen : color === 'orange' ? css.dotOrange : css.dotFilled;
  return (
    <div className={css.difficultyDots}>
      {[1, 2, 3].map(i => (
        <div key={i} className={classNames(css.dot, i <= level ? colorClass : null)} />
      ))}
    </div>
  );
};

// ─── Status Badge ───────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const labels = { active: 'Actif', ready: 'Pret', coming: 'Bientot' };
  const statusClass = status === 'active' ? css.statusActive : status === 'ready' ? css.statusReady : css.statusComing;
  return (
    <span className={classNames(css.statusBadge, statusClass)}>
      <span className={css.statusDot} />
      {labels[status]}
    </span>
  );
};

// ─── Integration Card ───────────────────────────────────────────
const IntegrationCard = ({ data, onOpen }) => (
  <div
    className={data.featured ? css.cardFeatured : css.integrationCard}
    onClick={() => onOpen(data.id)}
    role="button"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onOpen(data.id)}
  >
    {data.featured && <span className={css.recommendedBadge}>Recommande</span>}
    <StatusBadge status={data.status} />
    <div className={classNames(css.cardIcon, data.icon)}>{data.emoji}</div>
    <div className={css.cardTitle}>{data.title}</div>
    <div className={css.cardDesc}>{data.desc}</div>
    <div className={css.difficulty}>
      Difficulte :
      <DifficultyDots level={data.difficulty} color={data.difficultyColor} />
      {data.difficultyLabel}
    </div>
    <div className={css.cardTags}>
      {data.tags.map(t => (
        <span
          key={t.label}
          className={classNames(
            css.tag,
            t.style === 'sync' ? css.tagSync : t.style === 'auto' ? css.tagAuto : t.style === 'easy' ? css.tagEasy : null
          )}
        >
          {t.label}
        </span>
      ))}
    </div>
    <div className={css.cardFooter}>
      {data.buttons.map(b => (
        <button
          key={b.label}
          className={b.type === 'primary' ? css.btnPrimary : b.type === 'secondary' ? css.btnSecondary : css.btnDisabled}
          onClick={e => {
            e.stopPropagation();
            if (b.type !== 'disabled') onOpen(data.id);
          }}
        >
          {b.label}
        </button>
      ))}
    </div>
  </div>
);

// ─── Sync History Row ───────────────────────────────────────────
const SyncRow = ({ row }) => {
  const statusClass =
    row.status === 'success' ? css.syncStatusSuccess : row.status === 'error' ? css.syncStatusError : css.syncStatusPending;
  const statusIcon = row.status === 'success' ? '\u2705' : row.status === 'error' ? '\u274C' : '\u23F3';
  return (
    <div className={css.syncTableRow}>
      <div className={css.syncRowTitle}>{row.title}</div>
      <div className={css.syncRowMeta}>
        <span className={css.syncMethod}>
          {row.methodEmoji} {row.method}
        </span>
        <span>{row.action}</span>
        <span className={statusClass}>
          {statusIcon} {row.statusLabel}
        </span>
        <span>{row.date}</span>
      </div>
    </div>
  );
};

// ─── API Modal ──────────────────────────────────────────────────
const ApiModal = ({ onClose }) => (
  <div className={css.modalOverlayActive} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={css.modal}>
      <button className={css.modalClose} onClick={onClose}>{'\u2715'}</button>
      <div className={css.modalTitle}>{'\u{1F50C}'} API REST COBUCO</div>
      <div className={css.modalDesc}>
        Utilisez votre cle API pour envoyer vos annonces directement depuis votre systeme informatique.
      </div>
      <div className={css.modalLabel}>Votre cle API :</div>
      <div className={css.apiKeyBox}>
        cobuco_live_sk_7f2a9b4c8e1d3f6a5b0c9d8e...
        <button className={css.copyBtn} onClick={e => { e.target.textContent = 'Copie !'; }}>Copier</button>
      </div>
      <div className={css.modalLabel}>Endpoint :</div>
      <div className={css.apiKeyBox}>
        POST https://sync.cobuco.com/api/v1/listings
        <button className={css.copyBtn} onClick={e => { e.target.textContent = 'Copie !'; }}>Copier</button>
      </div>
      <div className={css.modalLabelSpaced}>Exemple rapide :</div>
      <div className={css.apiKeyBox}>
        {'curl -X POST https://sync.cobuco.com/api/v1/listings \\\n  -H "X-API-Key: votre_cle" \\\n  -d \'{"title": "Bureau 4 postes", "price": 450}\''}
      </div>
      <button className={css.btnFullPrimary} style={{ marginTop: 14 }}>Voir la documentation complete</button>
      <button className={css.btnFullOutline} style={{ marginTop: 10 }}>Regenerer ma cle API</button>
    </div>
  </div>
);

// ─── Excel Modal ────────────────────────────────────────────────
const ExcelModal = ({ onClose }) => (
  <div className={css.modalOverlayActive} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={css.modal}>
      <button className={css.modalClose} onClick={onClose}>{'\u2715'}</button>
      <div className={css.modalTitle}>{'\u{1F4D7}'} Import Excel / CSV</div>
      <div className={css.modalDesc}>Importez vos annonces en masse en 3 etapes simples :</div>
      <div className={css.stepsRow}>
        <div className={css.step}>
          <div className={css.stepNumber}>1</div>
          <div className={css.stepTitle}>Telechargez</div>
          <div className={css.stepSub}>le modele Excel</div>
        </div>
        <div className={css.step}>
          <div className={css.stepNumber}>2</div>
          <div className={css.stepTitle}>Remplissez</div>
          <div className={css.stepSub}>vos annonces</div>
        </div>
        <div className={css.step}>
          <div className={css.stepNumber}>3</div>
          <div className={css.stepTitle}>Importez</div>
          <div className={css.stepSub}>en un clic</div>
        </div>
      </div>
      <button className={css.btnFullOutline}>Telecharger le modele Excel COBUCO</button>
      <div className={css.uploadZone}>
        <div className={css.uploadZoneIcon}>{'\u{1F4C1}'}</div>
        <div className={css.uploadZoneText}>Glissez votre fichier ici</div>
        <div className={css.uploadZoneSub}>ou cliquez pour selectionner (.xlsx, .csv)</div>
      </div>
      <button className={css.btnFullPrimary}>Lancer l'import</button>
    </div>
  </div>
);

// ─── Zapier Modal ───────────────────────────────────────────────
const ComingSoonModal = ({ onClose, title, emoji, useCases }) => (
  <div className={css.modalOverlayActive} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={css.modal}>
      <button className={css.modalClose} onClick={onClose}>{'\u2715'}</button>
      <div className={css.modalTitle}>{emoji} {title}</div>
      <div className={css.modalDesc}>Cette integration sera bientot disponible.</div>
      <div className={css.comingSoonBox}>
        <div className={css.comingSoonIcon}>{'\u{1F6A7}'}</div>
        <div className={css.comingSoonTitle}>Bientot disponible</div>
        <div className={css.comingSoonSub}>Nous travaillons sur cette integration. Soyez notifie des qu'elle sera prete !</div>
      </div>
      {useCases && useCases.length > 0 && (
        <>
          <div className={css.useCaseLabel}>Cas d'usage prevus :</div>
          <div className={css.useCaseList}>
            {useCases.map(uc => (
              <div key={uc}>{'\u2705'} {uc}</div>
            ))}
          </div>
        </>
      )}
      <button className={css.btnFullPrimary} style={{ marginTop: 16 }}>Me notifier quand c'est pret</button>
    </div>
  </div>
);

// ─── Modal Configs ──────────────────────────────────────────────
const COMING_SOON_CONFIGS = {
  zapier: {
    title: 'Zapier / Make',
    emoji: '\u26A1',
    useCases: [
      'Google Sheets \u2192 COBUCO (sync automatique)',
      'Airtable \u2192 COBUCO',
      'Notion \u2192 COBUCO',
      'CRM (HubSpot, Pipedrive) \u2192 COBUCO',
      'Alertes email a chaque nouvelle sync',
    ],
  },
  pms: {
    title: 'Logiciel de gestion (PMS)',
    emoji: '\u{1F3E2}',
    useCases: ['Nexudus', 'OfficeRnD', 'Archie', 'Cobot', 'Essensys'],
  },
  ubiflow: {
    title: 'Ubiflow (Multidiffusion)',
    emoji: '\u{1F310}',
    useCases: ['BureauxLocaux', 'SeLoger Bureau', 'Geolocaux', 'Tous les portails Ubiflow'],
  },
  xml: {
    title: 'Flux XML / RSS',
    emoji: '\u{1F4E1}',
    useCases: ['Import periodique automatique', 'Mapping de champs personnalise', 'Support Atom et RSS 2.0'],
  },
};

// ─── Main Page Component ────────────────────────────────────────
const SyncDashboardPageComponent = props => {
  const { scrollingDisabled } = props;
  const intl = useIntl();
  const [activeModal, setActiveModal] = useState(null);

  const title = 'Connectez vos annonces | COBUCO';
  const description = 'Synchronisez automatiquement vos espaces depuis vos outils existants vers COBUCO.';

  return (
    <Page title={title} description={description} scrollingDisabled={scrollingDisabled}>
      <LayoutSingleColumn
        topbar={<TopbarContainer currentPage="SyncDashboardPage" />}
        footer={<FooterContainer />}
      >
        <UserNav currentPage="SyncDashboardPage" showManageListingsLink />

        {/* Hero */}
        <div className={css.hero}>
          <h1 className={css.heroTitle}>Connectez vos annonces</h1>
          <p className={css.heroSubtitle}>
            Synchronisez automatiquement vos espaces depuis vos outils existants vers COBUCO.
            Choisissez la methode qui vous convient.
          </p>
        </div>

        {/* Stats */}
        <div className={css.statsBar}>
          <div className={css.statCard}>
            <div className={css.statValue}>12</div>
            <div className={css.statLabel}>Annonces synchronisees</div>
          </div>
          <div className={css.statCard}>
            <div className={css.statValue}>98%</div>
            <div className={css.statLabel}>Taux de sync reussi</div>
          </div>
          <div className={css.statCard}>
            <div className={css.statValue}>3min</div>
            <div className={css.statLabel}>Derniere synchronisation</div>
          </div>
          <div className={css.statCard}>
            <div className={css.statValue}>API</div>
            <div className={css.statLabel}>Methode active</div>
          </div>
        </div>

        {/* Main Content */}
        <div className={css.main}>
          <div className={css.sectionTitle}>Methodes d'integration</div>
          <div className={css.sectionSubtitle}>Choisissez comment envoyer vos annonces sur COBUCO</div>

          <div className={css.integrationsGrid}>
            {INTEGRATIONS.map(integration => (
              <IntegrationCard key={integration.id} data={integration} onOpen={setActiveModal} />
            ))}
          </div>

          <div className={css.sectionTitle}>Historique de synchronisation</div>
          <div className={css.sectionSubtitle}>Les dernieres activites de synchronisation</div>

          <div className={css.syncTable}>
            <div className={css.syncTableHeader}>
              <div>Annonce</div>
              <div>Methode</div>
              <div>Action</div>
              <div>Statut</div>
              <div>Date</div>
            </div>
            {SYNC_HISTORY.map((row, i) => (
              <SyncRow key={i} row={row} />
            ))}
          </div>
        </div>

        {/* Modals */}
        {activeModal === 'api' && <ApiModal onClose={() => setActiveModal(null)} />}
        {activeModal === 'excel' && <ExcelModal onClose={() => setActiveModal(null)} />}
        {COMING_SOON_CONFIGS[activeModal] && (
          <ComingSoonModal
            onClose={() => setActiveModal(null)}
            {...COMING_SOON_CONFIGS[activeModal]}
          />
        )}
      </LayoutSingleColumn>
    </Page>
  );
};

const mapStateToProps = state => ({
  scrollingDisabled: isScrollingDisabled(state),
});

const SyncDashboardPage = connect(mapStateToProps)(SyncDashboardPageComponent);

export default SyncDashboardPage;
