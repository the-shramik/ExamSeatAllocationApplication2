import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-hall-ticket',
  templateUrl: './hall-ticket.component.html',
  styleUrls: ['./hall-ticket.component.css'],
})
export class HallTicketComponent implements OnInit {
  hallTicketData: any = {};
  block: any = {};
  studentData: any;
  studentHallData: any;
  isConditionMatched! : boolean
  foundMatch!: boolean;
  constructor(private admin: AdminService) {}

  ngOnInit(): void {
    // this.fetchHallTicketData();
    this.studentData = this.admin.getStudentData();   
    this.admin.getBlckBySeatNumber(this.studentData.seatNumber).subscribe(
      (res)=>{
        this.block = res
        this.getStudentinfo(this.block.blockId, this.studentData.seatNumber);
        this.toggleCondition();
        console.log(this.block);
        
      }
    )
  }

  toggleCondition() {
    this.isConditionMatched = !this.isConditionMatched;
  }

  getStudentinfo(blockId: any, seatNo: any) {
    this.studentData.blockId = blockId;
    this.studentData.seatNumber = seatNo;
    console.log(this.studentData);

  }

  // fetchHallTicketData() {
  //   this.admin.getHallTicketData(this.prn).subscribe(
  //     (data) => {
  //       this.hallTicketData = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching hall ticket data', error);
  //     }
  //   );
  // }
  downloadPDF() {
    const element = document.querySelector('.hall-ticket') as HTMLElement;
    const downloadButton = document.querySelector('button') as HTMLElement;

    if (downloadButton) {
      // Hide the download button temporarily
      downloadButton.style.display = 'none';
    }

    // Generate the PDF using html2canvas
    html2canvas(element, {
      scale: 2, // Higher scale for better quality
    })
      .then((canvas) => {
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190; // Adjust for margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add the image to the PDF and save it
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('hall_ticket.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      })
      .finally(() => {
        // Restore the visibility of the download button
        if (downloadButton) {
          downloadButton.style.display = '';
        }
      });
  }
}
