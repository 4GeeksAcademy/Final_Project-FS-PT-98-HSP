from sqlalchemy import Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import db
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .users import User
    from .apartments import Apartment
    from .contracts import Contract

class AssocTenantApartmentContract(db.Model):
    __tablename__ = 'assoc_tenants_apartments_contracts'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tenant_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    apartment_id: Mapped[int] = mapped_column(ForeignKey('apartments.id'), nullable=True)
    contract_id: Mapped[int] = mapped_column(ForeignKey('contracts.id'), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    tenant: Mapped['User'] = relationship(
        back_populates='association'
    )
    apartment: Mapped['Apartment'] = relationship(
        back_populates='association'
    )
    contract: Mapped['Contract'] = relationship(
        back_populates='association'
    )

    def serialize(self):
        return{
            "id":self.id,
            "tenant_id": self.tenant_id, 
            "apartment_id": self.apartment_id,
            "contract_id": self.contract_id,
            "is_active": self.is_active
        }
