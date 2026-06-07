// app.js - Car Brand & Model Portal Logic

document.addEventListener('DOMContentLoaded', () => {
  // Check if CAR_DATA is loaded
  if (typeof CAR_DATA === 'undefined') {
    console.error("CAR_DATA could not be loaded!");
    return;
  }

  // Active state
  let currentTab = 'html'; // html, json, js, php, sql
  let selectedBrandSlug = 'all'; // 'all' or specific brand slug
  let activeExpandedCard = null;

  // DOM Elements
  const themeToggle = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-input');
  const brandsGrid = document.getElementById('brands-grid');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const brandSelector = document.getElementById('brand-selector');
  const codeBlock = document.getElementById('code-block');
  const codeTitle = document.getElementById('code-title');
  const copyBtn = document.getElementById('copy-btn');
  const toast = document.getElementById('toast');
  const livePreviewContainer = document.getElementById('live-preview-container');

  // Load theme preference
  if (localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
  }

  // Toggle theme
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Populate brand selector dropdown in generator options
  function initSelectorDropdown() {
    brandSelector.innerHTML = '<option value="all">Tüm Markalar (Hepsi)</option>';
    
    Object.keys(CAR_DATA).forEach(slug => {
      const option = document.createElement('option');
      option.value = slug;
      option.textContent = CAR_DATA[slug].brandName;
      brandSelector.appendChild(option);
    });
  }

  // Render Brands List
  function renderBrands(filterQuery = '') {
    brandsGrid.innerHTML = '';
    const query = filterQuery.toLowerCase().trim();

    Object.keys(CAR_DATA).forEach(slug => {
      const brand = CAR_DATA[slug];
      const brandName = brand.brandName;
      const models = brand.models || [];
      
      // Filter logic: match brand name OR any model name
      const matchesBrand = brandName.toLowerCase().includes(query);
      const matchingModels = models.filter(m => m.name.toLowerCase().includes(query));
      const matchesModel = matchingModels.length > 0;

      if (query && !matchesBrand && !matchesModel) {
        return; // Skip if no match
      }

      // Create card element
      const card = document.createElement('div');
      card.className = 'brand-card fade-in';
      card.dataset.slug = slug;

      // Expand card if user searched and it matches model, or if explicitly clicked
      let isInitiallyExpanded = false;
      if (query && matchesModel && !matchesBrand) {
        isInitiallyExpanded = true;
        card.classList.add('expanded');
      }

      // Card Header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'brand-card-header';
      
      const leftDiv = document.createElement('div');
      leftDiv.className = 'brand-info-left';
      
      const avatar = document.createElement('div');
      avatar.className = 'brand-avatar';
      // First 2 letters of brand name
      avatar.textContent = brandName.substring(0, 2).toUpperCase();

      const nameSpan = document.createElement('span');
      nameSpan.className = 'brand-name';
      nameSpan.textContent = brandName;

      leftDiv.appendChild(avatar);
      leftDiv.appendChild(nameSpan);

      const rightDiv = document.createElement('div');
      rightDiv.className = 'brand-info-left'; // reuse alignment
      rightDiv.style.gap = '0.75rem';

      const badge = document.createElement('span');
      badge.className = 'model-count-badge';
      badge.textContent = `${models.length} Model`;

      // Chevron SVG Icon
      const chevron = document.createElement('div');
      chevron.className = 'chevron-icon';
      chevron.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
        </svg>
      `;

      rightDiv.appendChild(badge);
      rightDiv.appendChild(chevron);

      headerDiv.appendChild(leftDiv);
      headerDiv.appendChild(rightDiv);
      card.appendChild(headerDiv);

      // Models list accordion container
      const modelsListDiv = document.createElement('div');
      modelsListDiv.className = 'models-list';

      models.forEach(model => {
        const item = document.createElement('div');
        item.className = 'model-item';
        
        // Highlight matching search results
        const isHighlighted = query && model.name.toLowerCase().includes(query);
        if (isHighlighted) {
          item.style.borderLeft = '3px solid var(--accent-color)';
          item.style.background = 'var(--primary-glow)';
        }

        const mName = document.createElement('span');
        mName.textContent = model.name;
        item.appendChild(mName);

        if (model.bodyType) {
          const mType = document.createElement('span');
          mType.className = 'model-body-type';
          mType.textContent = model.bodyType;
          item.appendChild(mType);
        }
        modelsListDiv.appendChild(item);
      });

      card.appendChild(modelsListDiv);

      // Card click toggling
      card.addEventListener('click', (e) => {
        // Prevent toggling if user clicks inside the active models list (e.g. text selection)
        if (e.target.closest('.models-list')) return;

        const wasExpanded = card.classList.contains('expanded');
        
        // Collapse previously expanded cards (optional, but clean)
        document.querySelectorAll('.brand-card.expanded').forEach(c => {
          if (c !== card) c.classList.remove('expanded');
        });

        if (wasExpanded) {
          card.classList.remove('expanded');
        } else {
          card.classList.add('expanded');
          // Smooth scroll to view if needed
          setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 150);
        }
      });

      brandsGrid.appendChild(card);
    });

    if (brandsGrid.children.length === 0) {
      brandsGrid.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          <svg style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z"></path>
          </svg>
          <p style="font-weight: 600;">Eşleşen araç marka veya modeli bulunamadı.</p>
          <p style="font-size: 0.9rem; margin-top: 0.25rem;">Lütfen aramayı kontrol edin.</p>
        </div>
      `;
    }
  }

  // Filter selection helper
  function getSelectedData() {
    if (selectedBrandSlug === 'all') {
      return CAR_DATA;
    } else {
      const filtered = {};
      if (CAR_DATA[selectedBrandSlug]) {
        filtered[selectedBrandSlug] = CAR_DATA[selectedBrandSlug];
      }
      return filtered;
    }
  }

  // Generate Codes based on Selected Tab & Brand
  function generateCode() {
    const data = getSelectedData();
    let codeStr = '';

    switch (currentTab) {
      case 'html':
        codeTitle.textContent = 'HTML Select + JavaScript Kodu';
        codeStr = generateHTMLCode(data);
        break;
      case 'json':
        codeTitle.textContent = 'JSON Veri Yapısı';
        codeStr = JSON.stringify(data, null, 2);
        break;
      case 'js':
        codeTitle.textContent = 'JavaScript Nesnesi (JS Object)';
        codeStr = `const CAR_DATA = ${JSON.stringify(data, null, 2)};`;
        break;
      case 'php':
        codeTitle.textContent = 'PHP Dizi (Array) Kodu';
        codeStr = generatePHPCode(data);
        break;
      case 'sql':
        codeTitle.textContent = 'SQL Tabloları & INSERT İfadeleri';
        codeStr = generateSQLCode(data);
        break;
    }

    codeBlock.textContent = codeStr;
    updateLivePreview(data);
  }

  // Generate HTML chained selects code
  function generateHTMLCode(data) {
    const jsonEscaped = JSON.stringify(data).replace(/'/g, "\\'");
    return `<!-- Araç Marka & Model Seçim Kutusu -->
<div class="car-selector-box">
  <div class="input-group">
    <label for="brand-select" class="selector-label">Araç Markası</label>
    <select id="brand-select" name="brand" class="selector-select">
      <option value="">-- Marka Seçin --</option>
      ${Object.keys(data).map(slug => `<option value="${slug}">${data[slug].brandName}</option>`).join('\n      ')}
    </select>
  </div>

  <div class="input-group" style="margin-top: 15px;">
    <label for="model-select" class="selector-label">Araç Modeli</label>
    <select id="model-select" name="model" class="selector-select" disabled>
      <option value="">-- Önce Marka Seçin --</option>
    </select>
  </div>
</div>

<!-- Gerekli JavaScript (Dinamik doldurma için) -->
<script>
(function() {
  const carData = ${JSON.stringify(data)};
  
  const brandEl = document.getElementById('brand-select');
  const modelEl = document.getElementById('model-select');

  brandEl.addEventListener('change', function() {
    const slug = this.value;
    
    // Temizle
    modelEl.innerHTML = '<option value="">-- Model Seçin --</option>';
    
    if (!slug || !carData[slug]) {
      modelEl.disabled = true;
      return;
    }

    // Modelleri Ekle
    const models = carData[slug].models || [];
    models.forEach(model => {
      const opt = document.createElement('option');
      opt.value = model.slug;
      opt.textContent = model.name;
      // İsteğe bağlı gövde tipi eklentisi
      if (model.bodyType) {
        opt.textContent += ' (' + model.bodyType + ')';
      }
      modelEl.appendChild(opt);
    });

    modelEl.disabled = false;
  });
})();
</script>

<!-- Temel CSS Tasarımı (Özelleştirilebilir) -->
<style>
.car-selector-box {
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  font-family: system-ui, -apple-system, sans-serif;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
}
.selector-select {
  padding: 10px 12px;
  font-size: 15px;
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  background-color: #fff;
  color: #2d3748;
  outline: none;
  cursor: pointer;
  transition: border 0.2s;
}
.selector-select:focus {
  border-color: #3182ce;
}
.selector-select:disabled {
  background-color: #f7fafc;
  cursor: not-allowed;
}
</style>`;
  }

  // Generate PHP array code
  function generatePHPCode(data) {
    let php = '<?php\n\n$car_brands = [\n';
    
    Object.keys(data).forEach(slug => {
      const brand = data[slug];
      php += `    "${slug}" => [\n`;
      php += `        "brandName" => "${brand.brandName.replace(/"/g, '\\"')}",\n`;
      php += `        "models" => [\n`;
      
      (brand.models || []).forEach(model => {
        const nameEsc = model.name.replace(/"/g, '\\"');
        const slugEsc = model.slug.replace(/"/g, '\\"');
        const bType = model.bodyType ? `"${model.bodyType.replace(/"/g, '\\"')}"` : 'null';
        
        php += `            ["name" => "${nameEsc}", "slug" => "${slugEsc}", "bodyType" => ${bType}],\n`;
      });
      
      php += `        ]\n`;
      php += `    ],\n`;
    });
    
    php += '];\n';
    return php;
  }

  // Generate SQL schemas and inserts
  function generateSQLCode(data) {
    let sql = `-- Araç Marka ve Model Tablo Şemaları\n\n`;
    sql += `CREATE TABLE IF NOT EXISTS car_brands (\n`;
    sql += `    id INT AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `    name VARCHAR(100) NOT NULL,\n`;
    sql += `    slug VARCHAR(100) NOT NULL UNIQUE\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS car_models (\n`;
    sql += `    id INT AUTO_INCREMENT PRIMARY KEY,\n`;
    sql += `    brand_id INT NOT NULL,\n`;
    sql += `    name VARCHAR(100) NOT NULL,\n`;
    sql += `    slug VARCHAR(100) NOT NULL UNIQUE,\n`;
    sql += `    body_type VARCHAR(50) DEFAULT NULL,\n`;
    sql += `    FOREIGN KEY (brand_id) REFERENCES car_brands(id) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    
    sql += `-- Veri Ekleme Satırları\n\n`;

    Object.keys(data).forEach(slug => {
      const brand = data[slug];
      const brandNameEsc = brand.brandName.replace(/'/g, "''");
      sql += `-- ${brand.brandName}\n`;
      sql += `INSERT INTO car_brands (name, slug) VALUES ('${brandNameEsc}', '${slug}');\n`;
      sql += `SET @last_brand_id = LAST_INSERT_ID();\n`;

      if (brand.models && brand.models.length > 0) {
        sql += `INSERT INTO car_models (brand_id, name, slug, body_type) VALUES\n`;
        const modelInserts = brand.models.map(model => {
          const modelNameEsc = model.name.replace(/'/g, "''");
          const modelSlugEsc = model.slug.replace(/'/g, "''");
          const bType = model.bodyType ? `'${model.bodyType.replace(/'/g, "''")}'` : 'NULL';
          return `    (@last_brand_id, '${modelNameEsc}', '${modelSlugEsc}', ${bType})`;
        }).join(',\n');
        
        sql += modelInserts + ';\n';
      }
      sql += `\n`;
    });

    return sql;
  }

  // Update Live Preview fields dynamically
  function updateLivePreview(data) {
    livePreviewContainer.innerHTML = '';

    // Create selection elements
    const grp1 = document.createElement('div');
    grp1.style.display = 'flex';
    grp1.style.flexDirection = 'column';
    grp1.style.gap = '6px';

    const label1 = document.createElement('label');
    label1.textContent = 'Önizleme: Marka';
    label1.style.fontSize = '0.9rem';
    label1.style.fontWeight = '600';
    label1.style.color = 'var(--text-muted)';
    
    const select1 = document.createElement('select');
    select1.className = 'custom-select';
    select1.id = 'preview-brand-select';
    select1.innerHTML = '<option value="">-- Marka Seçin --</option>';

    Object.keys(data).forEach(slug => {
      const opt = document.createElement('option');
      opt.value = slug;
      opt.textContent = data[slug].brandName;
      select1.appendChild(opt);
    });

    grp1.appendChild(label1);
    grp1.appendChild(select1);

    const grp2 = document.createElement('div');
    grp2.style.display = 'flex';
    grp2.style.flexDirection = 'column';
    grp2.style.gap = '6px';

    const label2 = document.createElement('label');
    label2.textContent = 'Önizleme: Model';
    label2.style.fontSize = '0.9rem';
    label2.style.fontWeight = '600';
    label2.style.color = 'var(--text-muted)';

    const select2 = document.createElement('select');
    select2.className = 'custom-select';
    select2.id = 'preview-model-select';
    select2.disabled = true;
    select2.innerHTML = '<option value="">-- Önce Marka Seçin --</option>';

    grp2.appendChild(label2);
    grp2.appendChild(select2);

    livePreviewContainer.appendChild(grp1);
    livePreviewContainer.appendChild(grp2);

    // Event listener for live chained select
    select1.addEventListener('change', function() {
      const slug = this.value;
      select2.innerHTML = '<option value="">-- Model Seçin --</option>';
      
      if (!slug || !data[slug]) {
        select2.disabled = true;
        return;
      }

      const models = data[slug].models || [];
      models.forEach(model => {
        const opt = document.createElement('option');
        opt.value = model.slug;
        opt.textContent = model.name;
        if (model.bodyType) {
          opt.textContent += ` (${model.bodyType})`;
        }
        select2.appendChild(opt);
      });

      select2.disabled = false;
    });
  }

  // Copy to Clipboard
  copyBtn.addEventListener('click', () => {
    const code = codeBlock.textContent;
    navigator.clipboard.writeText(code).then(() => {
      // Show Success Toast
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }).catch(err => {
      console.error('Kopyalama hatası: ', err);
    });
  });

  // Event Listeners for Filters
  searchInput.addEventListener('input', (e) => {
    renderBrands(e.target.value);
  });

  // Tab buttons click
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      generateCode();
    });
  });

  // Brand selector change
  brandSelector.addEventListener('change', (e) => {
    selectedBrandSlug = e.target.value;
    generateCode();
    
    // Highlight selected card on the left list if specific brand selected
    document.querySelectorAll('.brand-card').forEach(card => {
      card.classList.remove('active');
      if (selectedBrandSlug !== 'all' && card.dataset.slug === selectedBrandSlug) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Initialize App
  initSelectorDropdown();
  renderBrands();
  generateCode();
});
