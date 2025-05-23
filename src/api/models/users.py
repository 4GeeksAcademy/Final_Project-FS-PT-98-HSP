from .database import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean, Integer, Enum
from typing import List, TYPE_CHECKING

roll_type = Enum('propietario', 'inquilino', 'admin', name="roll_type_enum")

if TYPE_CHECKING:
    from .contracts import Contract
    from . apartments import Apartment
    from .assoc_tenants_apartments_contracts import  AssocTenantApartmentContract

class User(db.Model):
    __tablename__= "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(50),nullable=False)
    phone: Mapped[int] = mapped_column(nullable=False)
    national_id: Mapped[str] = mapped_column(String(12), nullable=False)
    account_number: Mapped[str] = mapped_column(String(24), nullable=False)
    roll: Mapped[str] = mapped_column(roll_type, nullable=False)
    apartment: Mapped[List["Apartment"]] = relationship(
        back_populates="user"
    )
    contrat: Mapped[List["Contract"]] = relationship(
        back_populates="user"
    )
    association:Mapped[List["AssocTenantApartmentContract"]] = relationship(
        back_populates="user"
    )

    def serialize(self):
        return{
            "id":self.id,
            "first_name": self.first_name, 
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "phone": self.phone,
            "national_id": self.national_id,
            "account_number": self.account_number,
            "roll": self.roll
    

        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['apartment'] = [apartment.serialize() for apartment in self.apartment],
        data['contract'] = [contract.serialize() for contract in self.contract],
        data['asociation'] = [asociation.serialize() for asociation in self.asociation],
        return data 