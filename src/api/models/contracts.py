from .database import db
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, DateTime, ForeignKey
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from. assoc_tenants_apartments_contracts import AssocTenantApartmentContract
    

class Contract(db.Model):
    __tablename__="contracts"
    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    end_date:Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    document: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    owner: Mapped['User'] = relationship(
        back_populates='contracts'
    )    
    association:Mapped[List["AssocTenantApartmentContract"]] = relationship(
        back_populates="contract"
    )
   
    def serialize(self):
        return{
            "id":self.id,
            "start_date": self.start_date, 
            "end_date": self.end_date,
            "document": self.document,
            "owner_id": self.owner_id
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['owner'] = self.owner.serialize() if self.owner else None,
        data['association']=[association.serialize() for association in self.association],
        return data 
      
           