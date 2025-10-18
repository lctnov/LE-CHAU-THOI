'use strict';

(function () {
	const PRICE_URL = 'https://interview.switcheo.com/prices.json';
	const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

	const objElement = {
		form: document.getElementById('swap-form'),
		fromAmount: document.getElementById('from-amount'),
		toAmount: document.getElementById('to-amount'),
		fromToken: document.getElementById('from-token'),
		toToken: document.getElementById('to-token'),
		fromIcon: document.getElementById('from-icon'),
		toIcon: document.getElementById('to-icon'),
		flipBtn: document.getElementById('flip-btn'),
		maxBtn: document.getElementById('max-btn'),
		submitBtn: document.getElementById('submit-btn'),
		rateInfo: document.getElementById('rate-info'),
		message: document.getElementById('message'),
		fromBalance: document.getElementById('from-balance'),
		toBalance: document.getElementById('to-balance'),
	};

	/** State */
	const state = {
		prices: new Map(), // symbol -> price
		balances: new Map(), // simulated balances
	};

	function setIcon(imgEl, symbol) {
		const sym = (symbol || '').toUpperCase();
		imgEl.src = `${ICON_BASE}${encodeURIComponent(sym)}.svg`;
		imgEl.onerror = () => {
		// fallback to a transparent 1x1 svg data URL with colored circle + text could be heavy; use placeholder color block
		imgEl.onerror = null;
		imgEl.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><rect width=\"24\" height=\"24\" rx=\"12\" fill=\"#2a2f45\"/></svg>`);
		};
		imgEl.alt = `${sym} icon`;
	}

	function fmt(n, maxDp = 6) {
		if (!isFinite(n)) return '0';
		// show up to 6 dp, trim trailing zeros
		const s = Number(n).toLocaleString(undefined, { maximumFractionDigits: maxDp });
		return s;
	}

	function parseAmount(v) {
		if (typeof v !== 'string') return NaN;
		const cleaned = v.replace(/,/g, '').trim();
		if (cleaned === '') return NaN;
		const num = Number(cleaned);
		return isFinite(num) ? num : NaN;
	}

	function computeToAmount() {
		const fromSym = objElement.fromToken.value;
		const toSym = objElement.toToken.value;
		const amt = parseAmount(objElement.fromAmount.value);

		const fromPrice = state.prices.get(fromSym);
		const toPrice = state.prices.get(toSym);
		const out = (amt * fromPrice) / toPrice;

		let error = '';
		if (!fromSym || !toSym) error = 'Select both tokens.';
		else if (fromSym === toSym) error = 'Tokens must be different.';
		else if (!isFinite(amt)) {
			// người dùng chưa nhập gì thì không báo lỗi
			objElement.toAmount.value = '';
			setMessage('');
			updateSubmit(false);
			setRateInfo('');
			return;
		} 
		else if (amt <= 0) {
			error = 'Enter an amount greater than 0.';
		} 
		else if (!isFinite(fromPrice) || !isFinite(toPrice)) {
			error = 'Missing price for selected token.';
		}

		if (error) {
			objElement.toAmount.value = '';
			setMessage(error, 'error');
			setRateInfo('');
			updateSubmit(false);
			return;
		}

		objElement.toAmount.value = fmt(out);
		setMessage('');

		const rate = fromPrice / toPrice;
		const inverted = toPrice / fromPrice;
		setRateInfo(`1 ${fromSym} ≈ ${fmt(rate, 8)} ${toSym} · 1 ${toSym} ≈ ${fmt(inverted, 8)} ${fromSym}`);

		// balance validation
		const balance = state.balances.get(fromSym) ?? 0;
		if (amt > balance) {
			setMessage(`Insufficient balance. Available: ${fmt(balance)} ${fromSym}`, 'error');
			updateSubmit(false);
			return;
		}

		// "You receive"
		if (!isFinite(out) || out <= 0) {
			updateSubmit(false);
			setMessage('');
			return;
		}

		updateSubmit(true);
	}


	function updateSubmit(enabled) {
		objElement.submitBtn.disabled = !enabled;
	}

	function setMessage(text, type) {
		const el = objElement.message;
		el.textContent = text || '';
		el.classList.remove('error', 'success', 'show');

		if (text) {
			if (type) el.classList.add(type);
			// hiệu ứng fade-in
			setTimeout(() => el.classList.add('show'), 10);

			// auto-hide sau 3s (nếu là success)
			if (type === 'success') {
			clearTimeout(el._hideTimer);
			el._hideTimer = setTimeout(() => {
				el.classList.remove('show');
			}, 3000);
			}
		}
	}


	function setRateInfo(text) {
		objElement.rateInfo.textContent = text || '';
	}

	function populateSelect(select, symbols) {
		const prev = select.value;
		select.innerHTML = '';
		for (const sym of symbols) {
			const opt = document.createElement('option');
			opt.value = sym;
			opt.textContent = sym;
			select.appendChild(opt);
		}
		if (symbols.includes(prev)) select.value = prev;
	}

	function refreshIcons() {
		setIcon(objElement.fromIcon, objElement.fromToken.value);
		setIcon(objElement.toIcon, objElement.toToken.value);
	}

	function refreshBalances() {
		const fromSym = objElement.fromToken.value;
		const toSym = objElement.toToken.value;
		const fb = state.balances.get(fromSym) ?? 0;
		const tb = state.balances.get(toSym) ?? 0;
		objElement.fromBalance.textContent = `Balance: ${fmt(fb)} ${fromSym || ''}`.trim();
		objElement.toBalance.textContent = `Balance: ${fmt(tb)} ${toSym || ''}`.trim();
	}

	function flipTokens() {
		const a = objElement.fromToken.value;
		const b = objElement.toToken.value;
		objElement.fromToken.value = b;
		objElement.toToken.value = a;
		refreshIcons();
		refreshBalances();
		computeToAmount();
	}

	function setLoading(loading) {
		objElement.submitBtn.classList.toggle('loading', !!loading);
		objElement.submitBtn.disabled = !!loading || objElement.submitBtn.disabled;
	}

	function simulateBalances(symbols) {
		// deterministic pseudo balances based on symbol string
		for (const s of symbols) {
		const seed = Array.from(s).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
		const bal = Math.round(((seed % 97) + 3) * 12.34) / 10; // 1 dp
		state.balances.set(s, bal);
		}
	}

	async function loadPrices() {
		try {
		const res = await fetch(PRICE_URL, { cache: 'no-store' });
		if (!res.ok) throw new Error('Failed to load prices');
		const data = await res.json();
		normalizePrices(data);
		} catch (err) {
		setMessage('Unable to load prices. Please refresh.', 'error');
		console.error(err);
		}
	}

	function normalizePrices(data) {
		// Support two formats: array of objects or object map
		const map = new Map();
		if (Array.isArray(data)) {
		// choose the last occurrence per currency
		for (const item of data) {
			const sym = String(item?.currency || item?.symbol || '').toUpperCase();
			const p = Number(item?.price);
			if (!sym || !isFinite(p)) continue;
			map.set(sym, p);
		}
		} else if (data && typeof data === 'object') {
		for (const [k, v] of Object.entries(data)) {
			const sym = String(k).toUpperCase();
			const p = Number(v?.price ?? v);
			if (!isFinite(p)) continue;
			map.set(sym, p);
		}
		}
		state.prices = map;

		const symbols = Array.from(map.keys()).sort();
		populateSelect(objElement.fromToken, symbols);
		populateSelect(objElement.toToken, symbols);

		// defaults: prefer USDC -> ETH when available
		if (symbols.length >= 1) {
		const preferredFrom = symbols.includes('USDC') ? 'USDC' : symbols[0];
		let preferredTo = 'ETH';
		if (!symbols.includes(preferredTo) || preferredTo === preferredFrom) {
			preferredTo = symbols.find(s => s !== preferredFrom) || preferredFrom;
		}
		objElement.fromToken.value = preferredFrom;
		objElement.toToken.value = preferredTo;
		}

		simulateBalances(symbols);
		refreshIcons();
		refreshBalances();
		computeToAmount();
	}

	// Event bindings
	objElement.fromAmount.addEventListener('input', () => {
		setMessage('');
		computeToAmount();
	});

	objElement.fromToken.addEventListener('change', () => {
		refreshIcons();
		refreshBalances();
		computeToAmount();
	});

	objElement.toToken.addEventListener('change', () => {
		refreshIcons();
		refreshBalances();
		computeToAmount();
	});

	objElement.flipBtn.addEventListener('click', flipTokens);

	objElement.maxBtn.addEventListener('click', () => {
		const balance = state.balances.get(objElement.fromToken.value) ?? 0;
		objElement.fromAmount.value = String(balance);
		computeToAmount();
	});

	objElement.form.addEventListener('submit', async (e) => {
		e.preventDefault();
		computeToAmount();
		if (objElement.submitBtn.disabled) return;

		setMessage('');
		setLoading(true);
		await new Promise((r) => setTimeout(r, 1200));
		setLoading(false);

		const fromSym = objElement.fromToken.value;
		const toSym = objElement.toToken.value;
		const amt = parseAmount(objElement.fromAmount.value);
		const fromPrice = state.prices.get(fromSym);
		const toPrice = state.prices.get(toSym);
		const out = (amt * fromPrice) / toPrice;

		// cập nhật balance mô phỏng
		const fb = state.balances.get(fromSym) ?? 0;
		const tb = state.balances.get(toSym) ?? 0;
		state.balances.set(fromSym, Math.max(0, fb - amt));
		state.balances.set(toSym, tb + out);

		refreshBalances();
		setMessage(`Swapped ${fmt(amt)} ${fromSym} → ${fmt(out)} ${toSym}`, 'success');
		objElement.submitBtn.classList.add('glow-success');
		setTimeout(() => objElement.submitBtn.classList.remove('glow-success'), 1000);
		objElement.fromAmount.value = '';
		objElement.toAmount.value = '';
		updateSubmit(false);
	});

	loadPrices();
})();
