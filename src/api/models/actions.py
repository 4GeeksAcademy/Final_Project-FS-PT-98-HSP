from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from .database import db
from typing import TYPE_CHECKING


if TYPE_CHECKING:
    from .issues import Issue

class Action(db.Model):
    __tablename__ = 'actions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    action_name: Mapped[str] = mapped_column(String(250), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[str] = mapped_column(String(350), nullable=False)
    contractor: Mapped[str] = mapped_column(String(150), nullable=False)
    bill_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    bill_image: Mapped[str] = mapped_column(String(50), nullable=False)
    issue_id: Mapped[int] = mapped_column(ForeignKey('issues.id'), nullable=False)
    issue: Mapped ['Issue'] = relationship(
         back_populates='actions'
    )

    def serialize(self):
        return {
            "action_id": self.action_id,
            "issue_id": self.id,
            "status": self.status,
            "action_name": self.action_name,
            "start_date": self.start_date,
            "description": self.description,
            "contractor": self.contractor,
            "bill_amount": self.bill_amount,
            "bill_image": self.end_date
        }
    
    def serialize_with_relations(self):
        data = self.serialize()
        data['issue'] = self.issue.serialize()
        return data
