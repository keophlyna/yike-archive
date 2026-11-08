const styles = {
	row: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 18 },
};

// Label and input styles come from AuthForm so these match its other fields.
export default function NameFields({ t, firstName, lastName, onFirstNameChange, onLastNameChange, labelStyle, inputStyle }) {
	return (
		<div style={styles.row}>
			<label style={labelStyle}>{t.firstName}<input style={inputStyle} type="text" value={firstName} onChange={(event) => onFirstNameChange(event.target.value)} autoComplete="given-name" maxLength={60} required /></label>
			<label style={labelStyle}>{t.lastName}<input style={inputStyle} type="text" value={lastName} onChange={(event) => onLastNameChange(event.target.value)} autoComplete="family-name" maxLength={60} required /></label>
		</div>
	);
}
