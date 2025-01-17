import "./Widget.scss"

const Widget = ({title,heading,icon}) => {
  return (
    <div className='widget'>
     <p className="title">{title}</p>
     <h2>{heading}</h2>
     <div className="icon">
      <img src={icon} alt="err" />
     </div>
    </div>
  )
}

export default Widget