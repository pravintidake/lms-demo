const Input = ({ inpLbl, inpType, inpName, inpPlaceholder, inpValue, onChange, classes }: any) => {
    return (
        <div>
            {inpLbl && <label className="font-bold">{inpLbl}</label>}
            <input type={inpType} name={inpName} placeholder={inpPlaceholder} value={inpValue} onChange={onChange} className={classes} />
        </div>
    )
}

export default Input