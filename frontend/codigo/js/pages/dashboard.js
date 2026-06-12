const BASE_URL = 'http://localhost:3000';
const ESTADO_EXCLUIDO = 'borrador';

const labelCorto = (estado = '') => {
    const e = estado.toLowerCase();
    if (e.includes('abierta')) return 'Abierto';
    if (e.includes('cerrada')) return 'Cerrado';
    return estado;
};

const COLOR_ESTADO = (e = '') => {
    const s = e.toLowerCase();
    if (s.includes('abierta')) return '#0d6efd';
    if (s.includes('cerrada')) return '#0dcaf0';
    if (s.includes('activo')) return '#495057';
    return '#adb5bd';
};

const renderGrafico = (cursos) => {
    const canvas = document.getElementById('grafico-estados');
    if (!canvas) return;

    const conteo = cursos.reduce((acc, c) => {
        const e = c.estado ?? 'sin estado';
        acc[e] = (acc[e] ?? 0) + 1;
        return acc;
    }, {});

    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: Object.keys(conteo),
            datasets: [{
                data: Object.values(conteo),
                backgroundColor: Object.keys(conteo).map(COLOR_ESTADO),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 12 } } }
            }
        }
    });
};

const colorEstado = (estado = '') => {
    const e = estado.toLowerCase();
    return e.includes('abierta') ? 'success' : e.includes('cerrada') ? 'secondary' : 'primary';
};

const renderTabla = (cursos) => {
    const tbody = document.getElementById('tbody-cursos-dashboard');
    if (!tbody) return;
    tbody.innerHTML = cursos.length
        ? cursos.map(c => {
            const act = c.inscriptos_actuales ?? 0, max = c.inscriptos_max ?? 0;
            const pct = max > 0 ? Math.round((act / max) * 100) : 0;
            return `<tr>
                <td><strong>${c.nombre}</strong></td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="progress flex-grow-1" style="height:8px; min-width:80px">
                            <div class="progress-bar" style="width:${pct}%"></div>
                        </div>
                        <span class="small text-muted text-nowrap">${act}/${max}</span>
                    </div>
                </td>
                <td class="text-end">
                    <span class="badge rounded-pill bg-${colorEstado(c.estado)}" style="font-size:.7rem">${labelCorto(c.estado)}</span>
                </td>
            </tr>`;
        }).join('')
        : '<tr><td colspan="3" class="text-muted py-3">No hay cursos para este filtro.</td></tr>';
};

const renderCursosActivos = (cursos) => {
    const contenedor = document.getElementById('tabla-cursos-activos');
    if (!contenedor) return;

    const estados = [...new Set(cursos.map(c => c.estado).filter(Boolean))];
    let seleccionado = null;

    const actualizarChips = () =>
        document.querySelectorAll('.chip-filtro').forEach(btn => {
            const color = btn.dataset.estado === 'todos' ? 'dark' : colorEstado(btn.dataset.estado);
            const activo = btn.dataset.estado === (seleccionado ?? 'todos');
            btn.className = `btn btn-sm rounded-pill px-3 chip-filtro btn-${activo ? '' : 'outline-'}${color}`;
        });

    contenedor.innerHTML = `
        <div class="d-flex gap-2 flex-wrap mb-3" id="chips-filtro">
            <button class="btn btn-sm rounded-pill px-3 chip-filtro btn-dark" data-estado="todos" style="font-size:.8rem">Todos</button>
            ${estados.map(e => `
                <button class="btn btn-sm rounded-pill px-3 chip-filtro btn-outline-${colorEstado(e)}" data-estado="${e}" style="font-size:.8rem">${labelCorto(e)}</button>
            `).join('')}
        </div>
        <table class="table table-borderless align-middle mb-0">
            <thead><tr class="text-muted small border-bottom">
                <th class="fw-normal pb-2">Curso</th>
                <th class="fw-normal pb-2">Cupo</th>
                <th class="fw-normal pb-2 text-end">Estado</th>
            </tr></thead>
            <tbody id="tbody-cursos-dashboard"></tbody>
        </table>`;

    renderTabla(cursos);

    document.getElementById('chips-filtro').addEventListener('click', e => {
        const btn = e.target.closest('.chip-filtro');
        if (!btn) return;
        seleccionado = btn.dataset.estado === 'todos' ? null : btn.dataset.estado;
        actualizarChips();
        renderTabla(seleccionado ? cursos.filter(c => c.estado === seleccionado) : cursos);
    });
};

const cargarDashboard = async () => {
    try {
        const [resEstudiantes, resCursos] = await Promise.all([
            fetch(`${BASE_URL}/estudiantes`),
            fetch(`${BASE_URL}/cursos`)
        ]);

        if (resEstudiantes.ok) {
            const { total } = await resEstudiantes.json();
            const el = document.getElementById('count-estudiantes');
            if (el) el.textContent = total ?? '—';
        }

        if (resCursos.ok) {
            const { total, cursos } = await resCursos.json();
            const el = document.getElementById('count-cursos');
            if (el) el.textContent = total ?? '—';
            const cursosFiltrados = (cursos ?? []).filter(c => c.estado?.toLowerCase() !== ESTADO_EXCLUIDO);
            renderCursosActivos(cursosFiltrados);
            renderGrafico(cursosFiltrados);
        }
    } catch (e) {
        console.error('Error al cargar el dashboard:', e);
    }
};

document.addEventListener('DOMContentLoaded', cargarDashboard);
