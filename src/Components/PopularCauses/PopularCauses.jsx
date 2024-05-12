

import "./PopularCauses.scss"
const PopularCauses = ({ color, data }) => {
  return (
    <div
      className="causes"
      style={{
        backgroundColor: color,
      }}
    >
      <div className="upperSec">
        <h1>Why you use this platform</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Blanditiis,commodi tempora mollitia voluptatem
        </p>
      </div>
      <div className="lowerSec">
        {data.map((e) => (
          <div className="lowerCard" key={e.id}>
            <img src={e.img} alt="card" />
            <h4>{e.title}</h4>
            <span>Child health Care</span>
            <h6>400 Supports, 5,000000 raised</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Blanditiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi tiis,commodi tempora mollitia voluptatem recusandae impedit
              totam aperiam nesciunt doloremque magni neque placeat, laborum
              nisi
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCauses;
