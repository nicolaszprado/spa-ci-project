import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CarFront,
  Check,
  CircleDollarSign,
  Gauge,
  Heart,
  MapPin,
  Menu,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const initialListings = [
  {
    id: "fusca-1974",
    title: "Volkswagen Fusca 1300",
    year: 1974,
    price: 18500,
    mileage: 92000,
    city: "Campinas, SP",
    description: "Clássico muito bem cuidado, motor revisado e documentação em dia. Ótimo para passeios de fim de semana.",
    image: "https://images.unsplash.com/photo-1597528380211-6a945b42fe7e?auto=format&fit=crop&w=1000&q=85",
    tag: "Clássico",
  },
  {
    id: "opala-1982",
    title: "Chevrolet Opala Comodoro",
    year: 1982,
    price: 38900,
    mileage: 128000,
    city: "Curitiba, PR",
    description: "Opala Comodoro 4 cilindros, interior original conservado. Carro de garagem, pronto para transferir.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
    tag: "Oportunidade",
  },
  {
    id: "chevette-1986",
    title: "Chevrolet Chevette SL",
    year: 1986,
    price: 14700,
    mileage: 110000,
    city: "Belo Horizonte, MG",
    description: "Chevette alinhado, mecânica confiável e pintura em bom estado. Perfeito para quem gosta de carro raiz.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
    tag: "Bem cuidado",
  },
  {
    id: "kombi-1976",
    title: "Volkswagen Kombi 1600",
    year: 1976,
    price: 26900,
    mileage: 76000,
    city: "Sorocaba, SP",
    description: "Kombi corujinha em ótimo estado de conservação. Motor boxer revisado recentemente.",
    image: "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?auto=format&fit=crop&w=1000&q=85",
    tag: "Achado",
  },
  {
    id: "brasilia-1979",
    title: "Volkswagen Brasília",
    year: 1979,
    price: 21900,
    mileage: 84000,
    city: "Goiânia, GO",
    description: "Brasília pronta para rodar, interior preservado e pneus novos. Um belo exemplar para colecionar.",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=85",
    tag: "Clássico",
  },
  {
    id: "corcel-1984",
    title: "Ford Corcel II L",
    year: 1984,
    price: 16900,
    mileage: 97000,
    city: "Londrina, PR",
    description: "Corcel II com mecânica em dia, documentação sem pendências e bom espaço interno.",
    image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1000&q=85",
    tag: "Boa compra",
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

function getSavedListings() {
  try {
    const saved = localStorage.getItem("rei-da-catira-listings");
    return saved ? JSON.parse(saved) : initialListings;
  } catch {
    return initialListings;
  }
}

function ListingCard({ listing, onDetails }) {
  return (
    <article className="listing-card">
      <button className="listing-photo" onClick={() => onDetails(listing)} aria-label={`Ver detalhes de ${listing.title}`}>
        <img src={listing.image} alt={listing.title} loading="lazy" />
        <span className="listing-tag">{listing.tag}</span>
      </button>
      <div className="listing-body">
        <div className="listing-price">{formatPrice(listing.price)}</div>
        <h3>{listing.title}</h3>
        <div className="listing-meta">
          <span><CalendarDays size={15} /> {listing.year}</span>
          <span><Gauge size={15} /> {Number(listing.mileage).toLocaleString("pt-BR")} km</span>
        </div>
        <div className="listing-location"><MapPin size={15} /> {listing.city}</div>
        <button className="listing-link" onClick={() => onDetails(listing)}>
          Ver anúncio <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}

function ListingModal({ listing, onClose }) {
  if (!listing) return null;

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        <img className="detail-image" src={listing.image} alt={listing.title} />
        <div className="detail-content">
          <span className="eyebrow">{listing.tag}</span>
          <h2 id="detail-title">{listing.title}</h2>
          <div className="detail-price">{formatPrice(listing.price)}</div>
          <div className="detail-meta">
            <span><CalendarDays size={16} /> {listing.year}</span>
            <span><Gauge size={16} /> {Number(listing.mileage).toLocaleString("pt-BR")} km</span>
            <span><MapPin size={16} /> {listing.city}</span>
          </div>
          <p>{listing.description}</p>
          {listing.phone ? (
            <a className="button button-primary contact-button" href={`https://wa.me/55${listing.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
              Falar com vendedor <ArrowRight size={17} />
            </a>
          ) : (
            <p className="contact-note">Entre em contato com o vendedor para saber mais sobre este veículo.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function CreateListingModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    year: "",
    price: "",
    mileage: "",
    city: "",
    description: "",
    image: "",
    phone: "",
  });
  const [error, setError] = useState("");

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function submit(event) {
    event.preventDefault();
    const year = Number(form.year);
    const price = Number(form.price);
    const mileage = Number(form.mileage);
    if (!form.title.trim() || !form.city.trim() || !form.description.trim() || !year || price <= 0 || mileage < 0) {
      setError("Preencha os campos obrigatórios com valores válidos.");
      return;
    }

    onCreate({
      ...form,
      id: `anuncio-${Date.now()}`,
      title: form.title.trim(),
      year,
      price,
      mileage,
      city: form.city.trim(),
      image: form.image.trim() || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
      tag: "Seu anúncio",
    });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
        <div className="modal-heading">
          <div>
            <span className="eyebrow">Venda por aqui</span>
            <h2 id="create-title">Anuncie seu carro</h2>
            <p>Seu anúncio fica salvo neste navegador.</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        </div>
        <form onSubmit={submit}>
          <label className="field field-full">Nome do carro *
            <input name="title" value={form.title} onChange={updateField} placeholder="Ex.: Ford Corcel II" required maxLength={70} />
          </label>
          <div className="form-grid">
            <label className="field">Ano *
              <input name="year" type="number" value={form.year} onChange={updateField} placeholder="1984" min="1900" max={new Date().getFullYear() + 1} required />
            </label>
            <label className="field">Preço (R$) *
              <input name="price" type="number" value={form.price} onChange={updateField} placeholder="18000" min="1" required />
            </label>
            <label className="field">Quilometragem *
              <input name="mileage" type="number" value={form.mileage} onChange={updateField} placeholder="95000" min="0" required />
            </label>
            <label className="field">Cidade *
              <input name="city" value={form.city} onChange={updateField} placeholder="Campinas, SP" maxLength={60} required />
            </label>
          </div>
          <label className="field field-full">Descrição *
            <textarea name="description" value={form.description} onChange={updateField} placeholder="Conte um pouco sobre o estado do carro..." rows="3" maxLength={500} required />
          </label>
          <label className="field field-full">Link da foto
            <input name="image" type="url" value={form.image} onChange={updateField} placeholder="https://..." />
          </label>
          <label className="field field-full">WhatsApp (opcional)
            <input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="DDD + número" />
            <small>O contato será aberto pelo WhatsApp. Digite apenas números, DDD e telefone.</small>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-primary submit-button" type="submit"><Check size={17} /> Publicar anúncio</button>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [listings, setListings] = useState(getSavedListings);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recentes");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredListings = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const result = listings.filter((listing) => {
      const matchesSearch = !term || `${listing.title} ${listing.city} ${listing.year}`.toLocaleLowerCase("pt-BR").includes(term);
      return matchesSearch &&
        (!maxPrice || listing.price <= Number(maxPrice)) &&
        (!minYear || listing.year >= Number(minYear));
    });

    if (sort === "menor-preco") result.sort((a, b) => a.price - b.price);
    if (sort === "maior-preco") result.sort((a, b) => b.price - a.price);
    if (sort === "mais-antigos") result.sort((a, b) => a.year - b.year);
    return result;
  }, [listings, search, sort, maxPrice, minYear]);

  function createListing(listing) {
    const updated = [listing, ...listings];
    setListings(updated);
    localStorage.setItem("rei-da-catira-listings", JSON.stringify(updated));
    setShowCreate(false);
    setNotice("Anúncio publicado e salvo neste navegador!");
    window.setTimeout(() => setNotice(""), 3500);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setSearch("");
    setMaxPrice("");
    setMinYear("");
    setSort("recentes");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Rei da Catira - início">
          <span className="brand-mark"><CarFront size={25} strokeWidth={2.2} /></span>
          <span className="brand-name">rei da <strong>catira</strong><small>CLASSIFICADOS DE CARROS</small></span>
        </a>
        <nav className="main-nav" aria-label="Navegação principal">
          <a className="nav-active" href="#anuncios">Classificados</a>
          <a href="#sobre">Como funciona</a>
        </nav>
        <button className="button button-dark header-cta" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Anunciar carro
        </button>
        <button className="icon-button mobile-menu" onClick={() => setShowCreate(true)} aria-label="Anunciar carro"><Menu size={22} /></button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="hero-kicker"><span></span> O bom negócio tem história</div>
            <h1>Carro velho.<br /><span>Negócio novo.</span></h1>
            <p>O lugar certo pra encontrar aquele clássico veio que ainda tem muita estrada pela frente.</p>
            <a className="button button-primary hero-button" href="#anuncios">Explorar classificados <ArrowRight size={17} /></a>
            <div className="hero-trust"><BadgeCheck size={17} /> Bons negócios, sem enrolação.</div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=90" alt="Carro clássico estacionado na estrada" />
            <div className="hero-caption"><span className="caption-dot"></span><span>Clássicos que contam histórias</span><strong>DESDE SEMPRE</strong></div>
            <div className="hero-stamp"><span>FEITO PRA</span><strong>CATIRAR</strong><span>DESDE 2025</span></div>
          </div>
          <div className="hero-bottom-note"><span>01 — 06</span><span>ACHADOS DE TODO O BRASIL</span></div>
        </section>

        <section className="benefit-strip" id="sobre">
          <div><span className="benefit-icon"><CarFront size={20} /></span><span><strong>Só carro com história</strong><small>Clássicos e usados de verdade</small></span></div>
          <div><span className="benefit-icon"><CircleDollarSign size={20} /></span><span><strong>Negócio direto</strong><small>Converse com quem anuncia</small></span></div>
          <div><span className="benefit-icon"><BadgeCheck size={20} /></span><span><strong>É fácil anunciar</strong><small>Seu anúncio em poucos minutos</small></span></div>
        </section>

        <section className="classifieds-section" id="anuncios">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Garimpe sem pressa</span>
              <h2>Achados da <span>catira.</span></h2>
              <p>Carros usados, clássicos e cheios de personalidade.</p>
            </div>
            <button className="button button-outline desktop-cta" onClick={() => setShowCreate(true)}><Plus size={18} /> Quero anunciar</button>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <Search size={19} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busque por modelo ou cidade..." aria-label="Buscar por modelo ou cidade" />
              {search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Limpar busca"><X size={16} /></button>}
            </label>
            <button className={`filter-toggle ${showFilters ? "filter-open" : ""}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17} /> Filtros</button>
            <label className="sort-select"><ArrowDownUp size={16} /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar anúncios">
              <option value="recentes">Mais recentes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="mais-antigos">Carros mais antigos</option>
            </select></label>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <label className="field">Preço máximo (R$)<input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Sem limite" /></label>
              <label className="field">A partir do ano<input type="number" min="1900" max={new Date().getFullYear()} value={minYear} onChange={(event) => setMinYear(event.target.value)} placeholder="Qualquer ano" /></label>
              <button className="text-button" onClick={clearFilters}>Limpar filtros</button>
            </div>
          )}

          <div className="results-line"><span><strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? "anúncio encontrado" : "anúncios encontrados"}</span><span className="results-decoration"></span></div>

          {filteredListings.length ? (
            <div className="listing-grid">
              {filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} onDetails={setSelectedListing} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span><Search size={25} /></span>
              <h3>Nenhum carro encontrado</h3>
              <p>Tente mudar a busca ou limpar os filtros para ver mais anúncios.</p>
              <button className="button button-outline" onClick={clearFilters}>Limpar busca</button>
            </div>
          )}
        </section>

        <section className="sell-banner">
          <div className="sell-icon"><Heart size={22} /></div>
          <div><span className="eyebrow">Seu carro merece um novo dono</span><h2>Tem um clássico parado?</h2><p>Anuncie grátis e encontre quem vai cuidar bem dele.</p></div>
          <button className="button button-light" onClick={() => setShowCreate(true)}>Anunciar meu carro <ArrowRight size={17} /></button>
          <span className="banner-decoration">RC</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#"><span className="brand-mark"><CarFront size={22} /></span><span className="brand-name">rei da <strong>catira</strong><small>CLASSIFICADOS DE CARROS</small></span></a>
        <p>Feito pra quem acredita que carro bom é carro com história.</p>
        <span className="footer-copy">© 2025 Rei da Catira</span>
      </footer>

      {notice && <div className="toast" role="status"><Check size={17} /> {notice}</div>}
      {selectedListing && <ListingModal listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {showCreate && <CreateListingModal onClose={() => setShowCreate(false)} onCreate={createListing} />}
    </div>
  );
}
